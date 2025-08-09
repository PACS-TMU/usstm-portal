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
    const [activeSearch, setActiveSearch] = useState(!!initialValue);

    useEffect(() => {
        setInput(initialValue);
        setActiveSearch(!!initialValue);
    }, [initialValue]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch(input.trim());
            setActiveSearch(!!input.trim());
        }
    };

    const handleSearchClick = () => {
        onSearch(input.trim());
        setActiveSearch(!!input.trim());
    };

    const handleClearClick = () => {
        setInput("");
        onSearch("");
        setActiveSearch(false);
    };

    return (
        <div className="flex flex-col gap-2">
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
            {activeSearch && (
                <div className="flex items-center gap-2 mt-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded shadow-sm w-full md:w-auto animate-fade-in">
                    <span className="text-blue-700 font-medium text-sm md:text-base">
                        Viewing Search Results for &quot;{input}&quot;
                    </span>
                </div>
            )}
        </div>
    );
}
