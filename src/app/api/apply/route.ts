import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ── Types ─────────────────────────────────────────────────────────────────────
interface ApplyPayload {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  category: string;
  website?: string;
  description: string;
}

// ── Internal alert email (HTML) ───────────────────────────────────────────────
function buildInternalEmail(data: ApplyPayload): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Vendor Application</title>
</head>
<body style="margin:0;padding:0;background:#060e36;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060e36;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <!-- Header band -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a56db,#0d3095);padding:32px 40px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);">MLBMiLB Brotherhood</p>
              <h1 style="margin:8px 0 0;font-size:24px;font-weight:800;color:#ffffff;">New Vendor Application ⚾</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                ${buildRow("Full Name", data.name)}
                ${buildRow("Email", `<a href="mailto:${data.email}" style="color:#3d7cfa;">${data.email}</a>`)}
                ${buildRow("Phone", data.phone || "—")}
                ${buildRow("Business Name", data.businessName)}
                ${buildRow("Category", data.category)}
                ${buildRow("Website", data.website ? `<a href="${data.website}" style="color:#3d7cfa;">${data.website}</a>` : "—")}
              </table>

              <!-- Description -->
              <div style="margin-top:24px;">
                <p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.4);">Business Description</p>
                <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:10px;padding:16px;">
                  <p style="margin:0;font-size:14px;color:rgba(255,255,255,0.8);line-height:1.7;">${data.description}</p>
                </div>
              </div>

              <!-- CTA -->
              <div style="margin-top:32px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.06);">
                <a href="mailto:${data.email}?subject=Re: Your MLBMiLB Brotherhood Application"
                   style="display:inline-block;padding:12px 28px;background:#1a56db;color:#ffffff;font-size:14px;font-weight:600;border-radius:10px;text-decoration:none;">
                  Reply to Applicant →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;">
                Sent automatically by MLBMiLB Brotherhood • mlbmilb.com
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;">
        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:rgba(255,255,255,0.35);">${label}</p>
        <p style="margin:4px 0 0;font-size:14px;color:#ffffff;">${value}</p>
      </td>
    </tr>`;
}

// ── Applicant auto-responder (text-based premium HTML) ────────────────────────
function buildAutoResponder(data: ApplyPayload): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Application Received</title>
</head>
<body style="margin:0;padding:0;background:#060e36;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#060e36;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg,#1a56db 0%,#0d3095 100%);padding:40px 40px 36px;">
              <p style="margin:0 0 12px;font-size:36px;">⚾</p>
              <h1 style="margin:0;font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">You're in the queue, ${data.name.split(" ")[0]}.</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.65);line-height:1.6;">
                We received your application for <strong style="color:#ffffff;">${data.businessName}</strong>.<br/>
                The admins will review your submission shortly.
              </p>
            </td>
          </tr>

          <!-- Steps -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.4);">What happens next</p>

              ${buildStep("1", "Admin review", "A majority of moderators will review your business. This usually takes a few business days.")}
              ${buildStep("2", "$100 BAT Donation", "If approved, you'll be asked to make a $100 annual donation to the Baseball Assistance Team and email the receipt.")}
              ${buildStep("3", "Go live", "Once confirmed, your business is listed in the official Brotherhood directory.")}

              <div style="margin-top:32px;padding:20px;background:rgba(26,86,219,0.12);border:1px solid rgba(61,124,250,0.2);border-radius:12px;">
                <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.7);line-height:1.7;">
                  Questions? Reply directly to this email or reach us at
                  <a href="mailto:info@steamworks.io" style="color:#3d7cfa;text-decoration:none;">info@steamworks.io</a>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.05);">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.25);text-align:center;">
                MLBMiLB Brotherhood • mlbmilb.com<br/>
                You're receiving this because you submitted a vendor application.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildStep(num: string, title: string, body: string): string {
  return `
    <div style="display:flex;gap:16px;margin-bottom:20px;align-items:flex-start;">
      <div style="width:28px;height:28px;border-radius:8px;background:rgba(26,86,219,0.25);border:1px solid rgba(61,124,250,0.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:12px;font-weight:700;color:#3d7cfa;text-align:center;line-height:28px;">
        ${num}
      </div>
      <div>
        <p style="margin:0 0 4px;font-size:14px;font-weight:600;color:#ffffff;">${title}</p>
        <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.55);line-height:1.6;">${body}</p>
      </div>
    </div>`;
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: ApplyPayload = await req.json();

    // Basic server-side validation
    const { name, email, businessName, category, description } = body;
    if (!name || !email || !businessName || !category || !description) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const notifyEmail = process.env.NOTIFY_EMAIL ?? "info@steamworks.io";
    const fromEmail   = process.env.FROM_EMAIL   ?? "onboarding@resend.dev";

    // Fire both emails in parallel
    const [internalResult, autoResponderResult] = await Promise.allSettled([
      // 1. Internal alert to the admin
      resend.emails.send({
        from: `MLBMiLB Brotherhood <${fromEmail}>`,
        to:   [notifyEmail],
        subject: `⚾ New Vendor Application — ${businessName}`,
        html: buildInternalEmail(body),
        replyTo: email,
      }),

      // 2. Auto-responder to the applicant
      resend.emails.send({
        from: `MLBMiLB Brotherhood <${fromEmail}>`,
        to:   [email],
        subject: "We received your application — MLBMiLB Brotherhood",
        html: buildAutoResponder(body),
      }),
    ]);

    // Log any failures server-side without breaking the UX
    if (internalResult.status === "rejected") {
      console.error("[apply/route] Internal email failed:", internalResult.reason);
    }
    if (autoResponderResult.status === "rejected") {
      console.error("[apply/route] Auto-responder failed:", autoResponderResult.reason);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[apply/route] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
