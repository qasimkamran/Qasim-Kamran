"use client";

import { useState, type FormEvent } from "react";

const MESSAGE_MAX_LENGTH = 2000;

export default function ContactForm() {
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        setIsSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    message: formData.get("message"),
                }),
            });

            const result = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(result.error || "The message could not be sent.");
            }

            form.reset();
            setMessage("");
            setStatus({
                type: "success",
                message: "Thanks — your message has been sent.",
            });
        } catch (error) {
            setStatus({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "The message could not be sent.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    const fieldClassName =
        "mt-2 w-full rounded-md border border-purple-300/30 bg-[#2a123f] px-4 py-3 text-white outline-none transition-colors placeholder:text-purple-200/50 focus:border-purple-300";

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block font-medium" htmlFor="name">
                    Name
                </label>
                <input
                    className={fieldClassName}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    disabled={isSubmitting}
                    required
                />
            </div>

            <div>
                <label className="block font-medium" htmlFor="email">
                    Email
                </label>
                <input
                    className={fieldClassName}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={isSubmitting}
                    required
                />
            </div>

            <div>
                <label className="block font-medium" htmlFor="message">
                    Message
                </label>
                <div className="relative">
                    <textarea
                        className={`${fieldClassName} resize-none pb-9`}
                        id="message"
                        name="message"
                        rows={6}
                        maxLength={MESSAGE_MAX_LENGTH}
                        disabled={isSubmitting}
                        onInput={(event) =>
                            setMessage(event.currentTarget.value)
                        }
                        aria-describedby="message-character-count"
                        required
                    />
                    <span
                        className="pointer-events-none absolute bottom-3 right-3 text-xs text-purple-200/70"
                        id="message-character-count"
                        aria-live="polite"
                    >
                        {message.length} / {MESSAGE_MAX_LENGTH}
                    </span>
                </div>
            </div>

            <button
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-fuchsia-950/40 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                disabled={isSubmitting}
                type="submit"
            >
                <span className="text-lg leading-none">
                    {isSubmitting ? "Sending…" : "Submit"}
                </span>
            </button>

            {status && (
                <p
                    className={
                        status.type === "success"
                            ? "text-emerald-300"
                            : "text-red-300"
                    }
                    role={status.type === "error" ? "alert" : "status"}
                >
                    {status.message}
                </p>
            )}
        </form>
    );
}
