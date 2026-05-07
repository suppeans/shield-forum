import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

function redirectWithAuthMessage(status: "error" | "success", message: string) {
  const params = new URLSearchParams({ status, message });
  redirect(`/auth/sign-in?${params.toString()}`);
}

export function authErrorMessage(message: string) {
  if (message.toLowerCase().includes("email rate limit exceeded")) {
    return "Registration email quota is temporarily exhausted. Try again in about an hour, or ask the site owner to enable custom SMTP.";
  }

  return message;
}

export async function signIn(formData: FormData) {
  "use server";

  const { email, password } = credentials(formData);

  if (!email || !password) {
    redirectWithAuthMessage("error", "Enter your email and password.");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirectWithAuthMessage("error", "Authentication is not configured yet.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWithAuthMessage("error", authErrorMessage(error.message));
  }

  redirect("/profile");
}

export async function signUp(formData: FormData) {
  "use server";

  const { email, password } = credentials(formData);

  if (!email || !password) {
    redirectWithAuthMessage(
      "error",
      "Enter an email and password to create an account.",
    );
  }

  if (password.length < 8) {
    redirectWithAuthMessage("error", "Password must be at least 8 characters.");
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirectWithAuthMessage("error", "Authentication is not configured yet.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://shield-forum.vercel.app"}/profile`,
    },
  });

  if (error) {
    redirectWithAuthMessage("error", authErrorMessage(error.message));
  }

  if (!data.session) {
    redirectWithAuthMessage(
      "success",
      "Registration created. Check your email to confirm the account, then sign in.",
    );
  }

  redirect("/profile");
}

export async function signOut() {
  "use server";

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    redirect("/");
  }

  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
