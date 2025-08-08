import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
    const supabase = createClient();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome to your dashboard!</p>
            {/* Additional dashboard content can go here */}
        </div>
    )
}