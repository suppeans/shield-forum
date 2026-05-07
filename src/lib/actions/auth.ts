import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function credentials(formData: FormData) {
  return {
    email: String(formData.get("email") ?? "").trim(),
    password: String(formData.get("password") ?? ""),
  };
}

export async function signIn(formData: FormData) {
  "use server";

  const { email, password } = credentials(formData);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return;
  }

  redirect("/profile");
}

export async function signUp(formData: FormData) {
  "use server";

  const { email, password } = credentials(formData);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return;
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
