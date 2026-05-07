import { AuthForm } from "@/components/auth-form";
import { PageHeading } from "@/components/page-heading";

type SignInPageProps = {
  searchParams: Promise<{
    message?: string;
    status?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const status = params.status === "success" ? "success" : params.status === "error" ? "error" : undefined;
  const message = status ? params.message : undefined;

  return (
    <main className="page">
      <PageHeading
        label="Account"
        title="Sign in to participate"
        description="Use email and password authentication backed by Supabase Auth."
      />
      <AuthForm message={message} status={status} />
    </main>
  );
}
