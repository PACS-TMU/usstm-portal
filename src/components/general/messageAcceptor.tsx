"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AiOutlineClose } from "react-icons/ai";

export default function MessageAcceptor() {
    const searchParams = useSearchParams();
    const [visible, setVisible] = useState(true);

    const message = searchParams.get("message") || searchParams.get("error") || "";
    const type = searchParams.get("error") ? "error" : "success";

    useEffect(() => {
        if (message) setVisible(true);
    }, [message]);

    if (!message || !visible) return null;

    return (
        <div
            className={`fixed top-8 left-1/2 -translate-x-1/2 max-w-md w-full z-50 shadow-xl rounded-xl flex items-center px-6 py-4
                border
                ${type === "error"
                    ? "bg-red-100 border-red-300"
                    : "bg-green-100 border-green-300"
                }
            `}
        >
            <div className="flex-1 flex items-center gap-2">
                <span
                    className={`text-base font-semibold tracking-tight ${
                        type === "error" ? "text-red-800" : "text-green-800"
                    }`}
                >
                    {message}
                </span>
            </div>
            <button
                className="ml-4 p-2 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                onClick={() => setVisible(false)}
                aria-label="Dismiss"
            >
                <AiOutlineClose className="h-5 w-5 text-gray-500 hover:text-gray-700 transition-colors duration-300 ease-in-out" />
            </button>
        </div>
    );
}
