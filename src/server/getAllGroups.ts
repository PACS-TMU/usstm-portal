import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function getAllGroups() {
    const supabase = await createClient();
    const {data, error} = await supabase
        .from("users")
        .select("id, username");
    if (error) {
        console.error("Error fetching groups:", error);
        redirect("/dashboard/events?error=Failed%20to%20fetch%20groups.");
    }
    return data;
}
