import { NextResponse } from "next/server";
import { Resend } from "resend";

type ContactRequest = {
    name: string;
    email: string;
    message: string;
};

function isContactRequest(value: unknown): value is ContactRequest {
    if (!value || typeof value !== "object") {
        return false;
    }

    const body = value as Record<string, unknown>;

    return (
        typeof body.name === "string" &&
        typeof body.email === "string" &&
        typeof body.message === "string"
    );
}

function escapeHtml(value: string) {
    return value.replace(
        /[&<>'"]/g,
        (character) =>
            ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "'": "&#39;",
                '"': "&quot;",
            })[character] ?? character
    );
}

function createContactEmail(name: string, email: string, message: string) {
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    return `<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="color-scheme" content="light">
    <title>Website Enquiry</title>
  </head>
  <body style="margin:0;background:#f4f1f8;color:#251b2e;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">qasimkamran.com — ${safeName}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f1f8;">
      <tr>
        <td align="center" style="padding:40px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:620px;background:#ffffff;border:1px solid #e5ddec;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(35,18,49,0.08);">
            <tr>
              <td style="background:#241033;padding:30px 32px;">
                <div style="margin-bottom:10px;color:#c9a7e8;font-size:12px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">Qasim Kamran · Portfolio</div>
                <h1 style="margin:0;color:#ffffff;font-size:26px;line-height:1.25;">New Website Enquiry</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 22px;color:#665a6e;font-size:15px;line-height:1.6;">Someone submitted the contact form on your personal website.</p>

                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;border:1px solid #e8e1ed;border-radius:10px;">
                  <tr>
                    <td style="width:88px;padding:14px 16px;border-bottom:1px solid #e8e1ed;color:#74687c;font-size:13px;font-weight:700;text-transform:uppercase;">Name</td>
                    <td style="padding:14px 16px;border-bottom:1px solid #e8e1ed;color:#251b2e;font-size:15px;">${safeName}</td>
                  </tr>
                  <tr>
                    <td style="width:88px;padding:14px 16px;color:#74687c;font-size:13px;font-weight:700;text-transform:uppercase;">Email</td>
                    <td style="padding:14px 16px;font-size:15px;"><a href="mailto:${safeEmail}" style="color:#6d35a0;text-decoration:none;">${safeEmail}</a></td>
                  </tr>
                </table>

                <div style="margin-bottom:10px;color:#74687c;font-size:13px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;">Message</div>
                <div style="margin-bottom:28px;padding:20px;background:#f8f6fa;border-radius:8px;color:#312639;font-size:16px;line-height:1.65;white-space:pre-wrap;word-break:break-word;">${safeMessage}</div>

                <a href="mailto:${safeEmail}" style="display:inline-block;padding:13px 22px;background:#6d35a0;border-radius:8px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;">Reply to ${safeName}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#faf8fb;border-top:1px solid #eee7f2;color:#8a7e91;font-size:12px;line-height:1.5;">Sent automatically from the contact form on your personal website.</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
    let body: unknown;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Please provide a valid JSON request body." },
            { status: 400 }
        );
    }

    if (!isContactRequest(body)) {
        return NextResponse.json(
            { error: "Name, email, and message must be strings." },
            { status: 400 }
        );
    }

    const name = body.name.trim();
    const email = body.email.trim();
    const message = body.message.trim();

    if (!name || !email || !message) {
        return NextResponse.json(
            { error: "Name, email, and message are required." },
            { status: 400 }
        );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return NextResponse.json(
            { error: "Please provide a valid email address." },
            { status: 400 }
        );
    }

    if (message.length > 2000) {
        return NextResponse.json(
            { error: "Message must be 2,000 characters or fewer." },
            { status: 400 }
        );
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const from = process.env.CONTACT_FROM_EMAIL?.trim();
    const recipient =
        process.env.CONTACT_TO_EMAIL?.trim() || "qasimworkaus@gmail.com";

    if (!apiKey || !from) {
        console.error(
            "Contact form is missing RESEND_API_KEY or CONTACT_FROM_EMAIL."
        );

        return NextResponse.json(
            { error: "The contact form is not configured." },
            { status: 500 }
        );
    }

    try {
        const resend = new Resend(apiKey);

        const { data, error } = await resend.emails.send({
            from,
            to: recipient,
            subject: `qasimkamran.com — ${name.replace(/[\r\n]/g, " ")}`,
            replyTo: email,
            html: createContactEmail(name, email, message),
            text: [
                "NEW WEBSITE ENQUIRY",
                "===================",
                "",
                `From:  ${name}`,
                `Email: ${email}`,
                "",
                "MESSAGE",
                "-------",
                message,
                "",
                `Reply directly to: ${email}`,
            ].join("\n"),
        });

        if (error) {
            console.error("Resend error:", error);

            return NextResponse.json(
                { error: "The email could not be sent." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            id: data?.id,
        });
    } catch (error) {
        console.error("Contact form error:", error);

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}
