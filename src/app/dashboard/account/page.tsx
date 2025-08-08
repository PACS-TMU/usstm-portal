import { createClient } from "@/lib/supabase/server";
import CopyEmailButton from "@/components/general/copyEmail";
import Link from "next/link";

export default async function AccountPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Fetch user profile from 'users' table
    const { data: profile, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user?.id)
        .single();

    if (error || !profile) {
        return (
            <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Account Information
                </h2>
                <p className="text-red-500">
                    Unable to load your account information. Please{" "}
                    <Link href="/dashboard/contact">contact us</Link> if this
                    issue persists.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Account Information
            </h2>
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-600">
                        Group Username:
                    </span>
                    <span className="text-gray-900">
                        {profile.username || "-"}
                    </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-600">
                        Group Full Name:
                    </span>
                    <span className="text-gray-900">
                        {profile.group_name || "-"}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-600">Email:</span>
                    <span className="text-gray-900">{profile.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between">
                    <span className="font-semibold text-gray-600">
                        Account Created:
                    </span>
                    <span className="text-gray-900">
                        {user?.identities && user.identities[0]?.created_at
                            ? new Date(
                                  user.identities[0].created_at
                              ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                              })
                            : "-"}
                    </span>
                </div>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-lg flex flex-col sm:items-start sm:justify-between gap-3 sm:gap-0">
                <span className="text-highlight-dark text-base font-medium">
                    Need to update your info? Contact us at:
                </span>
                <div className="flex flex-col md:ml-2">
                    <CopyEmailButton email="tech@usstm.ca" />
                    <CopyEmailButton email="vp.operations@usstm.ca" />
                </div>
            </div>
        </div>
    );
}
