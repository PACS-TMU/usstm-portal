"use client";

import React, { useState, useEffect } from "react";

type EventSearchProps = {
    initialValue?: string;
    placeholder?: string;
    onSearch: (searchTerm: string) => void;
};

export default function EventSearch({
    initialValue = "",
    placeholder = "Search...",
    onSearch,
}: EventSearchProps) {
    const [input, setInput] = useState(initialValue);

    // Optional: keep input in sync if initialValue changes externally
    useEffect(() => {
        setInput(initialValue);
    }, [initialValue]);

    // Trigger search when pressing Enter in input field
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch(input.trim());
        }
    };

    const handleSearchClick = () => {
        onSearch(input.trim());
    };

    const handleClearClick = () => {
        setInput("");
        onSearch("");
    };

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <input
                type="text"
                value={input}
                placeholder={placeholder}
                className="flex-grow px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-highlight-blue dark:bg-gray-800 dark:text-white"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label={placeholder}
            />
            <div className="flex-row flex gap-2 w-full md:w-auto items-center justify-center">
                <button
                    onClick={handleSearchClick}
                    className="bg-highlight hover:bg-highlight-dark ease-in-out transition-colors duration-200 hover:cursor-pointer text-background px-4 py-2 rounded shadow"
                    aria-label="Search"
                >
                    Search
                </button>
                <button
                    onClick={handleClearClick}
                    className="bg-gray-300 hover:bg-gray-400 ease-in-out transition-colors duration-200 hover:cursor-pointer text-gray-800 px-4 py-2 rounded shadow"
                    aria-label="Clear search"
                >
                    Clear
                </button>
            </div>
        </div>
    );
}
