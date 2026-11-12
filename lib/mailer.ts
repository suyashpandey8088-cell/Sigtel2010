import { company } from "@/lib/content/site";

/**
 * Email notifications. Uses Resend when RESEND_API_KEY is configured; otherwise
 * enquiries are still stored, and the notification is written to the server log.
 */

interface EnquiryEmail {
  name: string;
  company?: string;
  email: string;
  phone: string;
  category: string;
  location?: string;
  message: string;
  attachment?: string;
}

export async function sendEnquiryNotification(enquiry: EnquiryEmail): Promise<{ delivered: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_NOTIFICATION_EMAIL || company.email;
  const from = process.env.ENQUIRY_FROM_EMAIL || "SIG-TEL Website <onboarding@resend.dev>";
  const subject = `New enquiry — ${enquiry.category} — ${enquiry.name}`;

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0C1929;line-height:1.6">
      <h2 style="margin:0 0 16px">New website enquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        ${row("Name", enquiry.name)}
        ${row("Company", enquiry.company || "—")}
        ${row("Email", enquiry.email)}
        ${row("Phone", enquiry.phone)}
        ${row("Category", enquiry.category)}
        ${row("Project location", enquiry.location || "—")}
        ${row("Attachment", enquiry.attachment || "—")}
      </table>
      <p style="margin-top:20px;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
      <hr style="border:none;border-top:1px solid #ddd;margin:24px 0" />
      <p style="font-size:12px;color:#778596">Sent from the SIG-TEL website contact form.</p>
    </div>`;

  if (!apiKey) {
    console.info("[mailer] RESEND_API_KEY not configured — enquiry notification logged instead:", {
      to,
      subject,
      enquiry,
    });
    return { delivered: false };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, reply_to: enquiry.email }),
    });
    if (!res.ok) {
      console.error("[mailer] Resend error", res.status, await res.text());
      return { delivered: false };
    }
    return { delivered: true };
  } catch (error) {
    console.error("[mailer] failed to send", error);
    return { delivered: false };
  }
}

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 12px 6px 0;color:#778596;font-size:13px;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:14px">${escapeHtml(value)}</td></tr>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
