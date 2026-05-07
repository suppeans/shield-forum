import { signIn, signUp } from "@/lib/actions/auth";
import { TranslatedText } from "./translated-text";

type AuthFormProps = {
  message?: string;
  status?: "error" | "success";
};

export function AuthForm({ message, status }: AuthFormProps) {
  return (
    <div className="grid knowledge-grid">
      <form className="panel stack" action={signIn}>
        <TranslatedText as="h2" translationKey="auth.signIn" />
        <AuthStatus message={message} status={status} />
        <label className="field">
          <TranslatedText translationKey="auth.email" />
          <input className="input" name="email" type="email" required />
        </label>
        <label className="field">
          <TranslatedText translationKey="auth.password" />
          <input className="input" name="password" type="password" required />
        </label>
        <button className="button" type="submit">
          <TranslatedText translationKey="auth.signIn" />
        </button>
      </form>
      <form className="panel stack" action={signUp}>
        <TranslatedText as="h2" translationKey="auth.createAccount" />
        <label className="field">
          <TranslatedText translationKey="auth.email" />
          <input className="input" name="email" type="email" required />
        </label>
        <label className="field">
          <TranslatedText translationKey="auth.password" />
          <input
            className="input"
            name="password"
            type="password"
            minLength={8}
            required
          />
        </label>
        <button className="button button-secondary" type="submit">
          <TranslatedText translationKey="auth.register" />
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
