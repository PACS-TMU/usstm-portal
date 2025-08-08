"use client";

import { useState } from "react";

export default function CopyEmailButton({ email }: { email: string }) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy email:", err);
        }
    }

    return (
        <div className="inline-block">
            <button
                type="button"
                onClick={handleCopy}
                className="text-highlight underline hover:text-highlight-dark transition"
            >
                {email}
            </button>
            {copied && (
                <span className="block mt-1 px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                    Email copied successfully
                </span>
            )}
        </div>
    );
}
