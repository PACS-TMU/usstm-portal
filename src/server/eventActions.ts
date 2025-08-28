"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

const REDIRECT_BASE = "/dashboard/events";

// Auth
export async function getCurrentUser() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Please sign in to continue."
            )}`
        );
    }
    return user;
}

// Username lookup
export async function getUsernameById(uid: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", uid)
        .single();

    if (error) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Could not load username."
            )}`
        );
    }
    return data?.username || "";
}

// --- helper: resolve usernames for a set of user IDs ---
async function resolveUsernamesByIds(
    supabase: Awaited<ReturnType<typeof createClient>>,
    ids: string[]
): Promise<Record<string, string>> {
    const unique = Array.from(new Set(ids)).filter(Boolean);
    if (unique.length === 0) return {};

    const { data: users, error: userErr } = await supabase
        .from("users")
        .select("id, username")
        .in("id", unique);

    if (userErr) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to resolve usernames."
            )}`
        );
    }

    const map: Record<string, string> = {};
    for (const u of users ?? []) map[u.id] = u.username ?? "";
    return map;
}

// Organizers for one event (id + name)
export async function getOrganizersForEvent(
    eventId: string
): Promise<{ id: string; name: string }[]> {
    const supabase = await createClient();

    const { data: orgRows, error: orgErr } = await supabase
        .from("organizers")
        .select("group_id")
        .eq("event_id", eventId);

    if (orgErr) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to load event organizers."
            )}`
        );
    }

    const ids = Array.from(new Set((orgRows ?? []).map((r) => r.group_id)));
    if (ids.length === 0) return [];

    const nameMap = await resolveUsernamesByIds(supabase, ids);
    return ids.map((id) => ({ id, name: nameMap[id] ?? "Unknown" }));
}

// Events for user (with creator/organizer names)
export async function getEventsForUser(uid: string) {
    const supabase = await createClient();

    // 1) Events where the user is an organizer
    const { data: orgRowsForUser, error: orgErr } = await supabase
        .from("organizers")
        .select("event_id")
        .eq("group_id", uid);

    if (orgErr) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to load organizer events."
            )}`
        );
    }

    const organizerEventIds = orgRowsForUser?.map((r) => r.event_id) ?? [];
    const filters: string[] = [`created_by.eq.${uid}`];
    if (organizerEventIds.length) {
        const quoted = organizerEventIds.map((id) => `"${id}"`).join(",");
        filters.push(`id.in.(${quoted})`);
    }

    const { data: events, error: evErr } = await supabase
        .from("events")
        .select("*")
        .or(filters.join(","));

    if (evErr) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to load events."
            )}`
        );
    }

    const safeEvents = events ?? [];
    if (safeEvents.length === 0) return [];

    // 2) All organizers for these events
    const eventIds = safeEvents.map((e) => e.id);
    const { data: allOrgRows, error: allOrgErr } = await supabase
        .from("organizers")
        .select("event_id, group_id")
        .in("event_id", eventIds);

    if (allOrgErr) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to load event organizers."
            )}`
        );
    }

    // 3) Resolve all usernames (creators + organizers)
    const creatorIds = safeEvents.map((e) => e.created_by);
    const organizerIds = Array.from(
        new Set((allOrgRows ?? []).map((r) => r.group_id))
    );
    const allIds = Array.from(new Set([...creatorIds, ...organizerIds]));
    const nameMap = await resolveUsernamesByIds(supabase, allIds);

    // 4) Index organizers by event
    const orgByEvent = new Map<string, string[]>();
    for (const row of allOrgRows ?? []) {
        if (!orgByEvent.has(row.event_id)) orgByEvent.set(row.event_id, []);
        orgByEvent.get(row.event_id)!.push(row.group_id);
    }

    // 5) Final shape for UI
    return safeEvents.map((e) => ({
        ...e,
        created_by_name: nameMap[e.created_by] ?? "Unknown",
        organizers: (orgByEvent.get(e.id) ?? []).map((id) => ({
            id,
            name: nameMap[id] ?? "Unknown",
        })),
        canManage: e.created_by === uid,
    }));
}

// Delete event (creator-only). Always redirects on success/error.
export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const user = await getCurrentUser();

    const { data: eventRow, error: evErr } = await supabase
        .from("events")
        .select("id, created_by")
        .eq("id", eventId)
        .single();

    if (evErr || !eventRow) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Could not load that event."
            )}`
        );
    }

    if (!user || eventRow.created_by !== user.id) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Only the creator can delete this event."
            )}`
        );
    }

    const { error } = await supabase.rpc(
        "delete_event_and_organizers_secured",
        {
            p_event_id: eventId,
        }
    );

    if (error) {
        console.error("Delete event error:", error);
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to delete event."
            )}`
        );
    }

    redirect(
        `${REDIRECT_BASE}?message=${encodeURIComponent(
            "Event deleted successfully!"
        )}`
    );
}

export async function addEvent(formData: FormData) {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const address = formData.get("address") as string;
    const start_time = formData.get("start") as string;
    const end_time = formData.get("end") as string;

    const groupIds = formData.getAll("organizingGroups") as string[];
    if (groupIds.length === 0) {
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "You must select at least one organizing group."
            )}`
        );
    }

    const supabase = await createClient();
    const user = await getCurrentUser();

    const { data, error } = await supabase.rpc("create_event_with_organizers", {
        p_title: title,
        p_description: description,
        p_location: location,
        p_address: address,
        p_start_time: start_time,
        p_end_time: end_time,
        p_created_by: user.id,
        p_group_ids: groupIds,
    });

    if (error || !data) {
        console.error("Create event error:", error);
        redirect(
            `${REDIRECT_BASE}?error=${encodeURIComponent(
                "Failed to create event. If the issue persists, please contact us."
            )}`
        );
    }

    redirect(
        `${REDIRECT_BASE}?message=${encodeURIComponent(
            "Event created successfully! You can now manage it."
        )}`
    );
}

// Fetch one event (with minimal fields)
export async function getEventById(eventId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

    if (error) {
        redirect(
            `/dashboard/events?error=${encodeURIComponent(
                "Failed to load event."
            )}`
        );
    }
    return data;
}

export async function updateEvent(formData: FormData) {
    const supabase = await createClient();
    const user = await getCurrentUser();

    const eventId = String(formData.get("eventId") || "");
    if (!eventId) {
        redirect(
            `/dashboard/events?error=${encodeURIComponent("Missing event id.")}`
        );
    }

    // Which fields were actually changed?
    const dirty = String(formData.get("dirty") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // Collect values only if marked dirty; otherwise pass null so RPC ignores
    const title = dirty.includes("title")
        ? (formData.get("title") as string)
        : null;
    const description = dirty.includes("description")
        ? (formData.get("description") as string)
        : null;
    const location = dirty.includes("location")
        ? (formData.get("location") as string)
        : null;
    const address = dirty.includes("address")
        ? (formData.get("address") as string)
        : null;
    const start_time = dirty.includes("start")
        ? (formData.get("start") as string)
        : null;
    const end_time = dirty.includes("end")
        ? (formData.get("end") as string)
        : null;
    const groupIds = dirty.includes("organizingGroups")
        ? (formData.getAll("organizingGroups") as string[])
        : null;

    // Authorization: ensure current user owns the event
    const { data: evRow, error: evErr } = await supabase
        .from("events")
        .select("id, created_by")
        .eq("id", eventId)
        .single();

    if (evErr || !evRow) {
        redirect(
            `/dashboard/events?error=${encodeURIComponent(
                "Could not load that event."
            )}`
        );
    }
    if (evRow.created_by !== user.id) {
        redirect(
            `/dashboard/events?error=${encodeURIComponent(
                "Only the creator can update this event."
            )}`
        );
    }

    const { error } = await supabase.rpc("update_event_with_organizers", {
        p_event_id: eventId,
        p_title: title,
        p_description: description,
        p_location: location,
        p_address: address,
        p_start_time: start_time,
        p_end_time: end_time,
        p_group_ids: groupIds,
    });

    if (error) {
        console.error("Update event error:", error);
        redirect(
            `/dashboard/events?error=${encodeURIComponent(
                "Failed to update event."
            )}`
        );
    }

    redirect(
        `/dashboard/events?message=${encodeURIComponent("Event updated.")}`
    );
}
