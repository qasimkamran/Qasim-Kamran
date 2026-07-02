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
            subject: `Personal Website Contact Form — ${name.replace(/[\r\n]/g, " ")}`,
            replyTo: email,
            text: [
                `Name: ${name}`,
                `Email: ${email}`,
                "",
                "Message:",
                message,
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
