"use client";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const forms = [
    {
        name: "Budget Request Template",
        url: "https://docs.google.com/spreadsheets/d/1nv6X_KiiyQVGBtFCUSAApTB9GCCBoOvMehxbx2q3rDw/edit?gid=0#gid=0",
        description:
            "Submit the budget request template to the finance team for review and approval of your projected expenses for the semester or year.",
    },
    {
        name: "Reimbursement Request Form",
        url: "https://form.asana.com/?k=ai-l-z8VFWXA5p6GWsjGnA&d=1207498115170020",
        description:
            "Request reimbursement for out-of-pocket expenses incurred on behalf of USSTM.",
    },
    {
        name: "Internal Invoices Form",
        url: "https://form.asana.com/?k=1NQgBEjWG1VBGSkzSBK0hA&d=1207498115170020",
        description:
            "Submit this form for internal transactions within TMU that require invoicing and don't currently have an invoice.",
    },
    {
        name: "External Invoices Form",
        url: "https://form.asana.com/?k=PzlZ-m9kEK2CvwGxs6Y0cg&d=1207498115170020",
        description:
            "Submit this form for external transactions that require invoicing and don't currently have an invoice.",
    },
    {
        name: "P-Card Request Form",
        url: "https://form.asana.com/?k=QT1kvTNB3yNyBEZY0wDjUA&d=1207498115170020",
        description:
            "Request use of the purchasing card (P-Card) for approved transactions so USSTM purchases it on your behalf.",
    },
];

export default function FinancePage() {
    const [openDesc, setOpenDesc] = useState<string | null>(null);

    const toggleDescription = (name: string) => {
        setOpenDesc((prev) => (prev === name ? null : name));
    };

    return (
        <div className="w-full max-w-xl bg-background rounded-xl shadow-lg p-8 flex flex-col items-center mx-auto mt-10">
            <h1 className="text-3xl font-bold text-highlight-dark mb-6 text-center">
                USSTM Finance Forms (2025–2026)
            </h1>
            <ul id="finance" className="space-y-6 flex flex-col w-full">
                {forms.map((form) => (
                    <li key={form.name} className="relative">
                        <a
                            href={form.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center md:justify-between w-full pl-4 py-2 md:px-6 md:py-4 rounded-lg bg-highlight text-background font-semibold text-base md:text-lg shadow hover:scale-105 transition-transform duration-300"
                        >
                            {/* Wrap mobile text and icon in flex container */}
                            <div className="flex w-full items-center md:w-auto">
                                {/* Text: 80% width on mobile */}
                                <span className="w-4/5 md:w-auto">
                                    {form.name}
                                </span>

                                {/* Mobile toggle icon container 20% width, right aligned */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDescription(form.name);
                                    }}
                                    className="md:hidden w-1/5 h-full flex justify-center text-background hover:text-accent focus:outline-none"
                                    aria-expanded={openDesc === form.name}
                                    aria-controls={`${form.name}-desc`}
                                    aria-label={`Toggle description for ${form.name}`}
                                    type="button"
                                >
                                    <FaInfoCircle />
                                </button>
                            </div>

                            {/* Desktop tooltip icon */}
                            <div className="hidden md:flex relative ml-3 group">
                                <FaInfoCircle className="text-background hover:text-accent cursor-pointer" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-left">
                                    {form.description}
                                </div>
                            </div>
                        </a>

                        {/* Mobile description below */}
                        {openDesc === form.name && (
                            <span
                                id={`${form.name}-desc`}
                                className="block mt-2 px-6 text-sm text-gray-700 md:hidden"
                            >
                                {form.description}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
