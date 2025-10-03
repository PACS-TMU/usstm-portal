import EventForm from "@/components/dashboard/events/eventForm";
import { addEvent } from "@/server/eventActions";
import getAllGroups from "@/server/getAllGroups";

export default async function AddEventPage() {
    const groups = await getAllGroups();
    console.log(groups);

    return (
        <main className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow mt-8">
            <h1 className="text-2xl font-bold mb-6">Add New Event</h1>
            <EventForm
                mode="create"
                groups={groups}
                onSubmitAction={addEvent}
            />
        </main>
    );
}
