import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Bakery Sign In — Homely Taste" },
      {
        name: "description",
        content: "Sign in to the Homely Taste bakery dashboard to review customer orders.",
      },
      { property: "og:title", content: "Bakery Sign In — Homely Taste" },
      { property: "og:description", content: "Owner sign in for the Homely Taste order history." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/orders` },
        });
        if (error) throw error;
        setInfo("Account created. If email confirmation is required, check your inbox.");
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) navigate({ to: "/orders" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/orders" });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary";

  return (
    <section className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Bakery sign in</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Order history is private. Sign in with homelytaste.25@gmail.com to view customer orders.
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <label className="block text-sm font-medium">
          Email
          <input
            type="email"
            required
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            required
            minLength={6}
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {info && <p className="text-sm text-muted-foreground">{info}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        className="mt-4 text-sm text-muted-foreground underline"
      >
        {mode === "signin" ? "First time? Create the owner account" : "Already have an account? Sign in"}
      </button>
    </section>
  );
}
