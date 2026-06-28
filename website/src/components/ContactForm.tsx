"use client";

import { useState } from "react";

const MESSAGE_MAX_LENGTH = 2000;

export default function ContactForm() {
    const [message, setMessage] = useState("");

    const fieldClassName =
        "mt-2 w-full rounded-md border border-purple-300/30 bg-[#2a123f] px-4 py-3 text-white outline-none transition-colors placeholder:text-purple-200/50 focus:border-purple-300";

    return (
        <form className="mt-8 space-y-6">
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
                className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-7 py-3 font-semibold text-white shadow-lg shadow-fuchsia-950/30 transition hover:-translate-y-0.5 hover:from-violet-500 hover:to-fuchsia-500 hover:shadow-xl hover:shadow-fuchsia-950/40 active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-300"
                type="submit"
            >
                <span className="text-lg leading-none">Submit</span>
            </button>
        </form>
    );
}
