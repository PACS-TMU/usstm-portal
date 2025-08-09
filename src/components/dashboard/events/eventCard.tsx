import Link from "next/link";
import { format } from "date-fns";

function formatEventDate(start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const sameDay = startDate.toDateString() === endDate.toDateString();
    const now = new Date();

    // Show year if event is past OR not in the current year
    const needsYear = (date: Date) =>
        date.getFullYear() !== now.getFullYear() || date < now;

    const dateFormat = (date: Date) =>
        format(date, needsYear(date) ? "MMMM d, yyyy" : "MMMM d");

    if (sameDay) {
        return `${dateFormat(startDate)} — ${format(
            startDate,
            "h:mm a"
        )} to ${format(endDate, "h:mm a")}`;
    } else {
        return `Starts: ${dateFormat(startDate)} — ${format(
            startDate,
            "h:mm a"
        )}\nEnds: ${dateFormat(endDate)} — ${format(endDate, "h:mm a")}`;
    }
}

export default function EventCard({
    event,
    onDelete,
}: {
    event: any;
    onDelete: (id: number) => void;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col gap-2 border border-gray-200 dark:border-gray-700">
            <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {event.title}
                </h2>
                <div className="flex flex-row mt-1 mb-2">
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                        {formatEventDate(event.start_time, event.end_time)}
                    </p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
                {event.description}
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                TMU Location: {event.location}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                Full Address: {event.address}
            </div>
            <div className="flex gap-2 mt-4">
                <Link
                    href={`/dashboard/events/${event.id}/manage`}
                    className="bg-highlight hover:bg-highlight-dark ease-in-out transition-colors duration-200 text-background px-3 py-1 rounded text-sm"
                >
                    Manage
                </Link>
                <button
                    onClick={() => onDelete(event.id)}
                    className="bg-red-500 hover:bg-red-600 hover:cursor-pointer ease-in-out transition-colors duration-200 text-background px-3 py-1 rounded text-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}
