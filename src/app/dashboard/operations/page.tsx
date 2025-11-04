"use client";
import { useState } from "react";
import { FaInfoCircle } from "react-icons/fa";

const resources = [
    {
        name: "Resource Sheet",
        url: "https://docs.google.com/spreadsheets/d/1Qa1UsFtjEiqlM6eEtCvIqwAfujF_u0-C/edit?usp=sharing&ouid=107751479446945748540&rtpof=true&sd=true",
        description:
            "Access the comprehensive list of general event supplies USSTM offers including cups, garbage bags, plates, utensils, media services, carts, tables, and chairs.",
    },
    {
        name: "Event Supplies & Request Form",
        url: "https://docs.google.com/forms/d/e/1FAIpQLSdQdvJO6K7V5Q6g5a7EBl_Oq86uMi7MH7052iAKzHPnqC12aQ/viewform",
        description:
            "Request supplies available for sign-out only, including craft supplies, board games, decorations, and more. Please specify the quantity you will be borrowing.",
    },
    {
        name: "Science Lounge Booking Form",
        url: "https://form.asana.com/?k=FNNzzwHAohuUc_jfYcWS3w&d=1207498115170020",
        description:
            "Request to book the Science Lounge for your group's events. Each student group may only book the space for a max of 2 times per month. Requests must be made at least 1 week prior to the event date.",
    },
    {
        name: "Graphics Request Form",
        url: "https://form.asana.com/?k=PvdgW4DrqC5iuVA7TnHZow&d=1207498115170020",
        description:
            "Request graphics to be made for social media purposes. Requests must be made at least 10 days in advance with enough information to create your graphic.",
    },
];

export default function OperationsPage() {
    const [openDesc, setOpenDesc] = useState<string | null>(null);

    const toggleDescription = (name: string) => {
        setOpenDesc((prev) => (prev === name ? null : name));
    };

    return (
        <div className="w-full max-w-xl bg-background rounded-xl shadow-lg p-8 flex flex-col items-center mx-auto mt-10">
            <h1 className="text-3xl font-bold text-highlight-dark mb-6 text-center">
                USSTM Operations Resources (2025–2026)
            </h1>
            <ul id="operations" className="space-y-6 flex flex-col w-full">
                {resources.map((resource) => (
                    <li key={resource.name} className="relative">
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center md:justify-between w-full pl-4 py-2 md:px-6 md:py-4 rounded-lg bg-highlight text-background font-semibold text-base md:text-lg shadow hover:scale-105 transition-transform duration-300 s"
                        >
                            {/* Wrap mobile text and icon in flex container */}
                            <div className="flex w-full items-center md:w-auto">
                                {/* Text: 80% width on mobile */}
                                <span className="w-4/5 md:w-auto">
                                    {resource.name}
                                </span>

                                {/* Mobile toggle icon container 20% width, right aligned */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toggleDescription(resource.name);
                                    }}
                                    className="md:hidden w-1/5 h-full flex justify-center text-background hover:text-accent focus:outline-none"
                                    aria-expanded={openDesc === resource.name}
                                    aria-controls={`${resource.name}-desc`}
                                    aria-label={`Toggle description for ${resource.name}`}
                                    type="button"
                                >
                                    <FaInfoCircle />
                                </button>
                            </div>

                            {/* Desktop tooltip icon */}
                            <div className="hidden md:flex relative ml-3 group">
                                <FaInfoCircle className="text-background hover:text-accent cursor-pointer" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 text-sm text-white bg-gray-800 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-left">
                                    {resource.description}
                                </div>
                            </div>
                        </a>

                        {/* Mobile description below */}
                        {openDesc === resource.name && (
                            <span
                                id={`${resource.name}-desc`}
                                className="block mt-2 px-6 text-sm text-gray-700 md:hidden"
                            >
                                {resource.description}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
