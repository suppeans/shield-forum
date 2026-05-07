import { signIn, signUp } from "@/lib/actions/auth";

export function AuthForm() {
  return (
    <div className="grid knowledge-grid">
      <form className="panel stack" action={signIn}>
        <h2>Sign in</h2>
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
