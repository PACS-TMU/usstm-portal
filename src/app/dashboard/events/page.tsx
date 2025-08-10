"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EventCard from "@/components/dashboard/events/eventCard";
import EventSearch from "@/components/dashboard/events/eventSearch";
import {
    getCurrentUser,
    getUsernameById,
    getEventsForUser,
    deleteEvent,
} from "@/server/eventActions";

type Event = {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    location: string;
    address: string;
    created_by: string;
};

type User = {
    id: string;
    email: string;
};

export default function EventsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState("");
    const [events, setEvents] = useState<Event[]>([]);
    const [search, setSearch] = useState("");
    const [pastSearch, setPastSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [pastPage, setPastPage] = useState(1);
    const PAST_EVENTS_PER_PAGE = 4;

    const fetchUserData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const user = await getCurrentUser();
            if (!user?.id) {
                setUsername("");
                setUser(null);
                setEvents([]);
                setLoading(false);
                return;
            }

            setUser({
                id: user.id,
                email: user.email ?? "",
            });

            const name = await getUsernameById(user.id);
            setUsername(name || "Unknown User");

            const fetchedEvents = await getEventsForUser(user.id);
            if (!Array.isArray(fetchedEvents)) {
                throw new Error("Invalid data format for events");
            }
            setEvents(fetchedEvents);
        } catch (err: any) {
            console.error(err);
            setError(
                err.message || "Something went wrong while loading events."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [searchParams.toString()]);

    const handleDelete = async (eventId: string) => {
        await deleteEvent(eventId);
    };

    const now = new Date();

    // Filter upcoming events by upcoming search term
    const upcomingEvents = events
        .filter((e) => new Date(e.start_time) > now)
        .filter((event) =>
            Object.values(event)
                .join(" ")
                .toLowerCase()
                .includes(search.trim().toLowerCase())
        )
        .sort(
            (a, b) =>
                new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );

    // Filter past events by past search term
    const pastEvents = events
        .filter((e) => new Date(e.end_time) < now)
        .filter((event) =>
            Object.values(event)
                .join(" ")
                .toLowerCase()
                .includes(pastSearch.trim().toLowerCase())
        )
        .sort(
            (a, b) =>
                new Date(b.end_time).getTime() - new Date(a.end_time).getTime()
        );

    const totalPastPages = Math.ceil(pastEvents.length / PAST_EVENTS_PER_PAGE);
    const pastEventsToShow = pastEvents.slice(
        (pastPage - 1) * PAST_EVENTS_PER_PAGE,
        pastPage * PAST_EVENTS_PER_PAGE
    );

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <div className="md:max-w-[70%]">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {username}&apos;s Upcoming Events
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your events: create new ones, edit, or delete
                        existing.
                    </p>
                </div>
                <button
                    onClick={() => router.push("/dashboard/events/add")}
                    className="mt-4 md:mt-0 bg-highlight hover:bg-highlight-dark hover:cursor-pointer ease-in-out transition-colors duration-200 text-background font-semibold px-4 py-2 rounded shadow"
                >
                    Add New Event
                </button>
            </div>

            {/* Search for upcoming */}
            <div className="mb-6">
                <EventSearch
                    placeholder="Search upcoming events..."
                    initialValue={search}
                    onSearch={(term) => setSearch(term)}
                />
            </div>

            {/* Loading/Error */}
            {loading && (
                <div className="text-center text-gray-500">
                    Loading events...
                </div>
            )}
            {error && <div className="text-center text-red-500">{error}</div>}

            {/* Upcoming events */}
            {!loading && !error && (
                <>
                    {upcomingEvents.length > 0 ? (
                        <div
                            id="upcoming-events"
                            className="grid gap-6 md:grid-cols-2 mb-12"
                        >
                            {upcomingEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    currentUserId={user?.id || ""}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-gray-500 mb-12">
                            No upcoming events found.
                        </div>
                    )}

                    {/* Past events section */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {username}&apos;s Past Events
                    </h2>

                    {/* Search for past */}
                    <div className="mb-6">
                        <EventSearch
                            placeholder="Search past events..."
                            initialValue={pastSearch}
                            onSearch={(term) => {
                                setPastSearch(term);
                                setPastPage(1); // reset pagination on search
                            }}
                        />
                    </div>

                    {pastEvents.length > 0 ? (
                        <>
                            <div
                                id="past-events"
                                className="grid gap-6 md:grid-cols-2"
                            >
                                {pastEventsToShow.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        currentUserId={user?.id || ""}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPastPages > 1 && (
                                <div className="flex justify-center items-center gap-4 mt-6">
                                    <button
                                        disabled={pastPage === 1}
                                        onClick={() => setPastPage((p) => p - 1)}
                                        className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:hover:cursor-not-allowed transition ease-in-out duration-200 ${
                                            pastPage !== 1 ? "hover:bg-gray-300 hover:cursor-pointer" : ""
                                        }`}
                                    >
                                        Prev
                                    </button>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        Page {pastPage} of {totalPastPages}
                                    </span>
                                    <button
                                        disabled={pastPage === totalPastPages}
                                        onClick={() =>
                                            setPastPage((p) => p + 1)
                                        }
                                        className={`px-3 py-1 rounded border border-gray-300 dark:border-gray-700 disabled:opacity-50 disabled:hover:cursor-not-allowed transition ease-in-out duration-200 ${
                                            pastPage !== totalPastPages ? "hover:bg-gray-300 hover:cursor-pointer" : ""
                                        }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No past events found.
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
