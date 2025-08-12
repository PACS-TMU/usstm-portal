"use client";
import { SubmitButton } from "@/components/form/submitButton";
import { addEvent } from "@/server/eventActions";

// Example groups, replace with your actual data source
const organizingGroups = [
    { id: "1", name: "Group Alpha" },
    { id: "2", name: "Group Beta" },
    { id: "3", name: "Group Gamma" },
];

export default function AddEventPage() {
    return (
        <main className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
            <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
            <form
                action={addEvent}
                className="space-y-6"
                aria-label="Add New Event Form"
            >
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Event Title<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        minLength={3}
                        maxLength={100}
                        autoComplete="off"
                        placeholder="Enter event title"
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                </div>

                <div>
                    <label
                        htmlFor="description"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Event Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        minLength={10}
                        maxLength={1000}
                        placeholder="Describe the event"
                        rows={4}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                    />
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label
                            htmlFor="location"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            TMU Building (N/A if not in TMU)
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            required
                            minLength={3}
                            maxLength={100}
                            autoComplete="off"
                            placeholder="Enter event location"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            htmlFor="address"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Full Address (Street Address or Online Link)
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            required
                            minLength={3}
                            maxLength={100}
                            autoComplete="off"
                            placeholder="Enter event address"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                        />
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label
                            htmlFor="start"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            Start Date & Time
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="start"
                            name="start"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            htmlFor="end"
                            className="block text-sm font-semibold text-gray-700 mb-1"
                        >
                            End Date & Time
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="datetime-local"
                            id="end"
                            name="end"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="organizingGroups"
                        className="block text-sm font-semibold text-gray-700 mb-1"
                    >
                        Organizing Group(s)
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <select
                            id="organizingGroups"
                            name="organizingGroups"
                            multiple
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                            size={organizingGroups.length > 3 ? 4 : organizingGroups.length}
                        >
                            {organizingGroups.map((group) => (
                                <option key={group.id} value={group.id} className="px-2">
                                    {group.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <p className="text-xs lg:text-sm text-gray-500 mt-1 mx-2">
                        Hold Ctrl (Windows) or Command (Mac) to select multiple groups. On mobile, tap to select/deselect.
                    </p>
                </div>

                <div className="pt-2 flex w-full">
                    <SubmitButton
                        pendingText="Adding..."
                        className="w-full md:w-auto mx-auto px-6 py-2 rounded-lg bg-highlight text-white font-semibold shadow hover:bg-highlight-dark focus:bg-highlight-blue transition"
                    >
                        Add Event
                    </SubmitButton>
                </div>
            </form>
        </main>
    );
}
