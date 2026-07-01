"use client";

import { useEffect } from "react";

export default function SiteBackgroundSync({
    background,
}: {
    background?: string;
}) {
    useEffect(() => {
        if (!background) {
            return;
        }

        const siteShell = document.querySelector<HTMLElement>(
            "[data-site-shell]",
        );

        if (!siteShell) {
            return;
        }

        const previousBackground = siteShell.style.getPropertyValue(
            "--site-background",
        );
        siteShell.style.setProperty("--site-background", background);

        return () => {
            if (previousBackground) {
                siteShell.style.setProperty(
                    "--site-background",
                    previousBackground,
                );
            } else {
                siteShell.style.removeProperty("--site-background");
            }
        };
    }, [background]);

    return null;
}
