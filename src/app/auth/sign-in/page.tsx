import { AuthForm } from "@/components/auth-form";
import { PageHeading } from "@/components/page-heading";

export default function SignInPage() {
  return (
    <main className="page">
      <PageHeading
        label="Account"
        title="Sign in to participate"
        description="Use email and password authentication backed by Supabase Auth."
      />
      <AuthForm />
    </main>
  );
}
