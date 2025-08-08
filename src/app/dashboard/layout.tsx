import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/navbar/navbar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login?message=Please log in to access the dashboard.");
    }

    return (
        <div>
            <Navbar />
            <main>
                {children}
            </main>
        </div>
    );
}
