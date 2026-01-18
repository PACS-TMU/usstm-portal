"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, act, Component, JSX } from "react";
import { SubmitButton } from "../form/submitButton";
import { changeUser } from "@/server/passwordManage";

export default function ActivateReset(): JSX.Element {
  const supabase = createClient();
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      setActivated(true);
    });
  }, [activated]);

  let resetContainer = (
    <div className="min-h-screen flex items-center justify-center bg-theme-background">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-theme-primary mb-6 text-center">
          Reset Your Password
        </h2>
        <form method="post">
          <div className="space-y-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Enter new password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="w-full px-4 py-2 border border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-dark"
            />
            <label htmlFor="confirm" className="block text-sm font-medium mb-1">
              Confirm password:
            </label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              className="w-full px-4 py-2 border border-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-dark"
            />
            <SubmitButton
              type="submit"
              formAction={changeUser}
              className="w-full cursor-pointer py-2 px-4 bg-highlight-dark text-background font-semibold rounded-md hover:bg-highlight ease-in-out duration-300 transition"
              pendingText="Processing..."
            >
              Change Password
            </SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );

  return <>{activated ? resetContainer : <p>Loading...</p>}</>;
}
