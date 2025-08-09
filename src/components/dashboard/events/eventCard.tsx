import Link from "next/link";
import { format } from "date-fns";
import ConfirmDialogue from "@/components/dashboard/events/confirmDialogue";

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
    currentUserId,
}: {
    event: any;
    onDelete: (id: string) => void;
    currentUserId: string;
}) {
    const canManage =
        event.created_by === currentUserId &&
        new Date(event.start_time) > new Date();

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
                <span className="font-semibold">TMU Location:</span>{" "}
                {event.location}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Full Address:</span>{" "}
                {event.address}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Organizers:</span>{" "}
                {event.organizers && event.organizers.length > 0
                    ? event.organizers.map((org: any) => org.name).join(", ")
                    : "None"}
            </div>{" "}
            <div className="text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Created By:</span>{" "}
                {event.created_by_name || "Unknown"}
            </div>
            <div className="flex gap-2 mt-4">
                {canManage ? (
                    <>
                        <Link
                            href={`/dashboard/events/${event.id}/manage`}
                            className="bg-highlight hover:bg-highlight-dark ease-in-out transition-colors duration-200 text-background px-3 py-1 rounded text-sm"
                        >
                            Manage
                        </Link>

                        <ConfirmDialogue
                            message="This will permanently delete the event and its organizers. Are you sure?"
                            onConfirm={() => onDelete(event.id)}
                        />
                    </>
                ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                        {event.created_by === currentUserId
                            ? "Past events cannot be deleted or managed."
                            : "Only the student group that created this event can manage or delete it."}
                    </div>
                )}
            </div>
        </div>
    );
}
