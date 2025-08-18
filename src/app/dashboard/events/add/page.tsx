"use client";
import { SubmitButton } from "@/components/form/submitButton";
import { addEvent } from "@/server/eventActions";
import GroupsSelect from "@/components/dashboard/events/selectGroups";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { redirect } from "next/navigation";


const nowLocal = () =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

export default function AddEventPage() {
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
    const [startValue, setStartValue] = useState<string>(""); // YYYY-MM-DDTHH:mm
    const [endValue, setEndValue] = useState<string>("");
    const [organizingGroups, setOrganizingGroups] = useState<{ id: string; username: string }[]>([]);

    const minNow = nowLocal();
    const endMin = startValue || minNow;

    const supabase = createClient();
    
    useEffect(() => {
        async function fetchUsers() {
            const { data, error } = await supabase
                .from("users")
                .select("id, username");

            if (error) {
                console.error("Error fetching users:", error);
                return redirect("/dashboard/events?error=failed to retrieve users");
            } else {
                setOrganizingGroups(
                    (data ?? []).map((user: { id: string; username: string }) => ({
                        id: user.id,
                        username: user.username,
                    }))
                );
            }
        }
        fetchUsers();
    }, []);

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

                <div>
                    <GroupsSelect
                        organizingGroups={organizingGroups}
                        selectedGroups={selectedGroups}
                        onChange={setSelectedGroups}
                    />
                    {/* Hidden inputs so selected IDs are submitted with FormData */}
                    {selectedGroups.map((id) => (
                        <input
                            key={id}
                            type="hidden"
                            name="organizingGroups"
                            value={id}
                        />
                    ))}
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
                            min={minNow}
                            required
                            value={startValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                setStartValue(v);
                                // If current end is before new start, bump end up to start
                                if (endValue && endValue < v) {
                                    setEndValue(v);
                                }
                            }}
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
                            min={
                                startValue
                                    ? (() => {
                                        // Parse startValue as local time and add 1 hour
                                        const [date, time] = startValue.split("T");
                                        const [hour, minute] = time.split(":").map(Number);
                                        const newHour = String(hour + 1).padStart(2, "0");
                                        return `${date}T${newHour}:${minute}`;
                                    })()
                                    : minNow
                            }
                            required
                            value={endValue}
                            onChange={(e) => setEndValue(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-highlight-blue focus:ring-2 focus:ring-highlight-blue transition"
                        />
                        {startValue && (
                            <p className="mt-1 text-xs text-gray-500">
                                End time cannot be before{" "}
                                {new Date(new Date(startValue).getTime() + 3600 * 1000).toLocaleString()}.
                            </p>
                        )}
                    </div>
                </div>

                <div className="pt-2 flex flex-col items-center justify-centerw-full">
                    <SubmitButton
                        pendingText="Adding..."
                        disabled={selectedGroups.length === 0}
                        className="w-full md:w-auto mx-auto px-6 py-2 rounded-lg bg-highlight text-white font-semibold shadow hover:bg-highlight-dark focus:bg-highlight-blue transition disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-75"
                    >
                        Add Event
                    </SubmitButton>
                    {selectedGroups.length === 0 && (
                        <p className="text-xs lg:text-sm text-gray-500 mt-1 mx-2">
                            You must pick at least one organizing group to add
                            an event.
                        </p>
                    )}
                </div>
            </form>
        </main>
    );
}
