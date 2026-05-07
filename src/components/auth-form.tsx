import { signIn, signUp } from "@/lib/actions/auth";

type AuthFormProps = {
  message?: string;
  status?: "error" | "success";
};

export function AuthForm({ message, status }: AuthFormProps) {
  return (
    <div className="grid knowledge-grid">
      <form className="panel stack" action={signIn}>
        <h2>Sign in</h2>
        <AuthStatus message={message} status={status} />
        <label className="field">
          Email
          <input className="input" name="email" type="email" required />
        </label>
        <label className="field">
          Password
          <input className="input" name="password" type="password" required />
        </label>
        <button className="button" type="submit">
          Sign in
        </button>
      </form>
      <form className="panel stack" action={signUp}>
        <h2>Create account</h2>
        <label className="field">
          Email
          <input className="input" name="email" type="email" required />
        </label>
        <label className="field">
          Password
          <input
            className="input"
            name="password"
            type="password"
            minLength={8}
            required
          />
        </label>
        <button className="button button-secondary" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}

function AuthStatus({
  message,
  status,
}: {
  message?: string;
  status?: "error" | "success";
}) {
  if (!message || !status) {
    return null;
  }

  return (
    <p
      className={`auth-status auth-status-${status}`}
      role={status === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {message}
    </p>
  );
}
