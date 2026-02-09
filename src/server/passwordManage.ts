"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function sendEmail(event: FormData) {
  const email = event.get("email") as string;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (userError) {
    return redirect(
      "/reset/auth?error=Email address not found in the portal system",
    );
  }

  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset/session`,
  });
  return redirect(
    "/reset/auth?message=An email has been sent. Please click on the Reset Password button to proceed.",
  );
}

export async function changeUser(event: FormData) {
  const supabase = await createClient();

  if ((event.get("password") as string) === (event.get("confirm") as string)) {
    const { data, error } = await supabase.auth.updateUser({
      password: event.get("password") as string,
    });

    redirect("/login");
  } else {
    redirect(
      "/reset/session?error=Password and confirmation need to be the same",
    );
  }
}
