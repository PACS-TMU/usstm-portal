import { redirect } from "next/navigation";
import {
    getCurrentUser,
    getEventById,
    getOrganizersForEvent,
} from "@/server/eventActions";

import getAllGroups from "@/server/getAllGroups";

import EventForm from "@/components/dashboard/events/eventForm";
import { updateEvent } from "@/server/eventActions";

interface ManageEventsPageProps {
    params: {
        event_id: string;
    };
}

export default async function ManageEventsPage({
    params: { event_id },
}: ManageEventsPageProps) {
    const user = await getCurrentUser();
    const event = await getEventById(event_id);
    if (!event) {
        redirect("/dashboard/events?error=Event%20not%20found");
    }
    if (event.created_by !== user.id) {
        redirect(
            "/dashboard/events?error=You%20can%20only%20manage%20your%20own%20events."
        );
    }

    const organizers = await getOrganizersForEvent(event_id);
    const allGroups = await getAllGroups();

    const initialValues = {
        eventId: event_id,
        title: event.title ?? "",
        description: event.description ?? "",
        location: event.location ?? "",
        address: event.address ?? "",
        start: event.start_time,
        end: event.end_time,
        groupIds: organizers.map((o) => o.id),
    };

    return (
        <main className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow mt-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Manage Event
                </h1>
            </div>

            <EventForm
                mode="edit"
                initialValues={initialValues}
                groups={allGroups}
                onSubmitAction={updateEvent}
            />
        </main>
    );
}
