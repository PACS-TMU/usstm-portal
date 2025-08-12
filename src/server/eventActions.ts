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
    supabase: ReturnType<typeof createClient> extends Promise<infer T>
        ? T
        : any,
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
        `${REDIRECT_BASE}?message=${encodeURIComponent("Event deleted.")}`
    );
}

export async function addEvent(formData: FormData) {
    return;
}
