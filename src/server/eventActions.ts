"use server";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();
    if (error) throw new Error("Failed to fetch current user");
    return user;
}

export async function getUsernameById(uid: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", uid)
        .single();

    if (error) throw new Error("Failed to fetch username");
    return data?.username || "";
}

export async function getEventsForUser(uid: string) {
    const supabase = await createClient();
    const { data: orgRows, error: orgErr } = await supabase
        .from("organizers")
        .select("event_id")
        .eq("group_id", uid);

    if (orgErr) throw new Error("Failed to fetch organizer events");

    const organizerEventIds = orgRows?.map((r) => r.event_id) ?? [];

    const { data: events, error: evErr } = await supabase
        .from("events")
        .select("*")
        .or(
            [
                `created_by.eq.${uid}`,
                organizerEventIds.length
                    ? `id.in.(${organizerEventIds.join(",")})`
                    : "id.eq.0",
            ].join(",")
        );

    if (evErr) throw new Error("Failed to fetch events");

    return (events ?? []).map((e) => ({
        ...e,
        canManage: e.created_by === uid,
    }));
}

export async function deleteEvent(eventId: number) {
    const supabase = await createClient();
    const user = await getCurrentUser();

    const { data: eventRow, error: evErr } = await supabase
        .from("events")
        .select("id, created_by")
        .eq("id", eventId)
        .single();

    if (evErr) throw new Error("Failed to load event");
    if (eventRow.created_by !== user?.id) {
        throw new Error("Only the creator can delete this event");
    }

    const { error } = await supabase.rpc(
        "delete_event_and_organizers_secured",
        {
            p_event_id: eventId,
        }
    );
    if (error) {
        console.error("Delete event error:", error);
        throw new Error("Failed to delete event");
    }
}