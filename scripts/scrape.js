#!/usr/bin/env node
/**
 * scripts/scrape.js
 * ────────────────────────────────────────────────────────────────────────────
 * Crawls https://mlbmilb.com, extracts the site structure, all page text,
 * and the full vendor directory listings, then writes clean JSON to:
 *   src/data/siteContent.json   – nav structure + raw page text per route
 *   src/data/directory.json     – structured vendor/business entries
 *
 * Run with:
 *   node scripts/scrape.js
 * ────────────────────────────────────────────────────────────────────────────
 */

const axios   = require('axios');
const cheerio = require('cheerio');
const fs      = require('fs');
const path    = require('path');

const BASE_URL = 'https://mlbmilb.com';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Strip excessive whitespace from a string */
const clean = (str = '') => str.replace(/\s+/g, ' ').trim();

/** Format a raw phone string into (XXX) XXX-XXXX, returns null if unformattable */
function formatPhone(raw = '') {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits[0] === '1') {
    return `(${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  }
  return digits.length >= 7 ? raw.trim() : null;
}

/** Map category labels from the original site to cleaned slugs */
function resolveCategory(rawLabel = '') {
  const l = rawLabel.toLowerCase();
  if (l.includes('web') || l.includes('market') || l.includes('graphic') || l.includes('seo') || l.includes('digital') || l.includes('social'))
    return 'Web & Marketing';
  if (l.includes('sport') || l.includes('apparel') || l.includes('uniform') || l.includes('bat') || l.includes('training') || l.includes('baseball'))
    return 'Sports & Apparel';
  if (l.includes('real estate') || l.includes('mortgage') || l.includes('property') || l.includes('airbnb') || l.includes('rental'))
    return 'Real Estate & Mortgage';
  if (l.includes('financ') || l.includes('invest') || l.includes('insurance') || l.includes('payment') || l.includes('money'))
    return 'Finance & Insurance';
  if (l.includes('health') || l.includes('wellness') || l.includes('medical') || l.includes('peptide') || l.includes('trt') || l.includes('pain') || l.includes('fitness'))
    return 'Health & Wellness';
  if (l.includes('travel') || l.includes('hunt') || l.includes('fish') || l.includes('lodge') || l.includes('vegas') || l.includes('adventure'))
    return 'Travel & Outdoors';
  if (l.includes('tech') || l.includes('software') || l.includes('app') || l.includes('vr') || l.includes('logistic') || l.includes('freight'))
    return 'Technology';
  if (l.includes('speaker') || l.includes('consult') || l.includes('coaching') || l.includes('mindset'))
    return 'Speaking & Consulting';
  return 'Other';
}

/** Fetch a URL and return a cheerio instance */
async function fetchPage(url) {
  console.log(`  Fetching: ${url}`);
  const { data } = await axios.get(url, {
    timeout: 15000,
    headers: { 'User-Agent': 'MLB-MILB-Scraper/1.0 (research; contact@example.com)' },
  });
  return cheerio.load(data);
}

// ── Site structure ────────────────────────────────────────────────────────────

const PAGES = [
  { route: '/',                   label: 'Home',             slug: 'home' },
  { route: '/vendors/',           label: 'Vendors',          slug: 'vendors' },
  { route: '/vendor-application/',label: 'Vendor Application', slug: 'vendor-application' },
  { route: '/fb-group-rules/',    label: 'FB Group Rules',   slug: 'fb-group-rules' },
  { route: '/resources/',         label: 'Resources',        slug: 'resources' },
  { route: '/deals/',             label: 'Deals',            slug: 'deals' },
];

// ── Vendor parser ─────────────────────────────────────────────────────────────

/**
 * Extracts vendor entries from the /vendors/ page.
 * The site groups vendors by category tab; each vendor is a <li> containing:
 *   • an <a> with name + business in the text
 *   • a description paragraph
 *   • phone and URL anchors at the bottom
 */
async function parseVendors() {
  const $ = await fetchPage(`${BASE_URL}/vendors/`);
  const vendors = [];

  // The vendor tabs/sections each have a heading (h2 or similar) then a <ul>
  // Walk every <li> inside the vendor accordion tabs
  $('li').each((_, el) => {
    const $li = $(el);
    const $a  = $li.find('a').first();
    if (!$a.length) return;

    const fullText = clean($a.text());
    if (!fullText || fullText.length < 5) return;

    // Name format: "FirstName LastName – Business Name"
    const dashIdx  = fullText.indexOf('–');
    const dashIdx2 = fullText.indexOf('-');
    const splitAt  = dashIdx > 0 ? dashIdx : dashIdx2 > 0 ? dashIdx2 : -1;

    let contactName  = '';
    let businessName = '';
    let description  = '';

    if (splitAt > 0) {
      contactName  = clean(fullText.slice(0, splitAt));
      businessName = clean(fullText.slice(splitAt + 1));
    } else {
      contactName = fullText;
    }

    // Description text (remove name/phone lines)
    const rawDesc = clean($li.text());
    description = rawDesc
      .replace(fullText, '')
      .replace(/tel:\S+/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .trim();

    // Phone: look for tel: href
    let phone = null;
    let phoneFormatted = null;
    $li.find('a[href^="tel:"]').each((_, pa) => {
      const raw = $(pa).attr('href').replace('tel:', '');
      if (raw && raw.length >= 7) {
        phone          = raw;
        phoneFormatted = formatPhone(raw);
        return false; // take first
      }
    });

    // Website URL
    let website = null;
    $li.find('a').each((_, wa) => {
      const href = $(wa).attr('href') || '';
      if (href.startsWith('http') && !href.includes('mlbmilb.com') && !href.startsWith('tel:')) {
        website = href;
        return false;
      }
    });

    if (!contactName && !businessName) return;
    if (businessName.toLowerCase() === 'tbd' || contactName.toLowerCase() === 'tbd') return;

    // Determine category from parent heading
    let rawCatLabel = '';
    $li.parents().each((_, parent) => {
      const prev = $(parent).prev('h2, h3, h4');
      if (prev.length) { rawCatLabel = clean(prev.text()); return false; }
    });

    vendors.push({
      id:            vendors.length + 1,
      contactName:   contactName || null,
      businessName:  businessName || contactName,
      description:   description || null,
      category:      resolveCategory(rawCatLabel || businessName || description),
      phone:         phoneFormatted,
      phoneDial:     phone ? `tel:${phone.replace(/\D/g,'')}` : null,
      website:       website,
    });
  });

  // Deduplicate by businessName
  const seen = new Set();
  return vendors.filter(v => {
    const key = v.businessName.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Page content scraper ──────────────────────────────────────────────────────

async function scrapePages() {
  const results = [];
  for (const page of PAGES) {
    try {
      const $ = await fetchPage(`${BASE_URL}${page.route}`);
      $('nav, header, footer, script, style, noscript').remove();
      const text = clean($('body').text());
      results.push({
        route: page.route,
        label: page.label,
        slug:  page.slug,
        title: clean($('title').text()),
        description: clean($('meta[name="description"]').attr('content') || ''),
        bodyText: text.slice(0, 4000),
      });
    } catch (e) {
      console.warn(`  ⚠ Failed to fetch ${page.route}:`, e.message);
    }
  }
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🔍  Starting MLBMiLB.com scrape...\n');

  const dataDir = path.join(__dirname, '..', 'src', 'data');
  fs.mkdirSync(dataDir, { recursive: true });

  // 1. Site content / structure
  console.log('📄  Scraping page content...');
  const siteContent = {
    siteName: 'MLBMiLB',
    baseUrl: BASE_URL,
    description: 'The Website Home For The Current and Retired MLB & MiLB Players Facebook Page',
    navigation: PAGES.map(p => ({ label: p.label, route: p.route, slug: p.slug })),
    pages: await scrapePages(),
  };

  const siteFile = path.join(dataDir, 'siteContent.json');
  fs.writeFileSync(siteFile, JSON.stringify(siteContent, null, 2));
  console.log(`✅  Wrote: src/data/siteContent.json  (${siteContent.pages.length} pages)`);

  // 2. Vendor directory
  console.log('\n🏢  Parsing vendor directory...');
  const vendors = await parseVendors();
  const directory = {
    generatedAt: new Date().toISOString(),
    source: `${BASE_URL}/vendors/`,
    totalVendors: vendors.length,
    categories: [...new Set(vendors.map(v => v.category))].sort(),
    vendors,
  };

  const dirFile = path.join(dataDir, 'directory.json');
  fs.writeFileSync(dirFile, JSON.stringify(directory, null, 2));
  console.log(`✅  Wrote: src/data/directory.json    (${vendors.length} vendors)`);

  console.log('\n🎉  Scrape complete!\n');
}

main().catch(err => {
  console.error('💥  Scrape failed:', err);
  process.exit(1);
});
