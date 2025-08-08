import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (error) {
        console.error("Error fetching user data:", error.message);
        return (
            <div>
                Error loading dashboard. Please{" "}
                <a
                    href="mailto:vp.operations@usstm.ca;tech@usstm.ca"
                    target="_blank"
                >
                    contact us
                </a>{" "}
                if this issue persists.
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">
                Welcome, {userData.username}!
            </h1>
            <p className="mb-6 text-gray-700">
                This dashboard is designed to empower student groups by
                providing easy access to essential resources. Here, you can
                seamlessly add and manage your events, as well as find important
                finance-related links and tools. Use the options below to get
                started and make the most of your student group experience. If
                you need any assistance, don't hesitate to <Link href="/dashboard/contact">contact us</Link>!
            </p>
            <div id="dashboard" className="flex flex-col sm:flex-row gap-4">
                <a
                    href="/dashboard/finance"
                    className="flex-1 px-6 py-3 bg-highlight text-white rounded-lg text-center font-semibold hover:bg-highlight-dark ease-in-out duration-300 transition"
                >
                    Finance Links
                </a>
                <a
                    href="/dashboard/events"
                    className="flex-1 px-6 py-3 bg-highlight text-white rounded-lg text-center font-semibold hover:bg-highlight-dark ease-in-out duration-300 transition"
                >
                    Manage Your Events
                </a>
            </div>
        </div>
    );
}
