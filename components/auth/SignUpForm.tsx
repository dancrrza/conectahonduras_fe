"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { translate } from "@/lib/translate";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Sanitize username: lowercase, no spaces, only alphanumeric + underscores/hyphens
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = e.target.value
      .toLowerCase()
      .replace(/\s/g, "")
      .replace(/[^a-z0-9_-]/g, "");
    setUsername(sanitized);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError(translate("passwords_do_not_match"));
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError(translate("username_min_chars"));
      setIsLoading(false);
      return;
    }

    try {
      // 1. Check username uniqueness before creating the auth user
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username)
        .maybeSingle();

      if (existingUser) {
        setError(translate("username_taken"));
        setIsLoading(false);
        return;
      }

      // 2. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            // Store name + username in auth metadata so the DB trigger
            // (or the redirect callback) can seed the profiles row.
            full_name: name,
            username,
          },
        },
      });

      if (authError) throw authError;

      // 3. If Supabase auto-confirms the user (e.g. in dev mode), insert the
      //    profile row immediately. Otherwise the email-confirm callback should
      //    do this. Adjust to match your own trigger/webhook setup.
      if (authData.user && !authData.user.email_confirmed_at === false) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          full_name: name,
          username,
        });

        if (profileError && profileError.code !== "23505") {
          // 23505 = unique_violation; means a DB trigger already inserted it
          throw profileError;
        }
      }

      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : translate("an_error_occurred"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#152a47] border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] gap-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-[1.75rem] font-extrabold tracking-tight text-slate-100 animate-fade-up">
            {translate("sign_up_title")}
          </CardTitle>
          <CardDescription className="text-foreground text-sm mb-0">
            {translate("create_new_account")}
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-up">
          <Separator className="bg-white/10 mb-6" />
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {/* ── Personal details ── */}
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                >
                  {translate("full_name_label")}
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Jane Doe"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                >
                  {translate("username_label")}
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-sm select-none">
                    @
                  </span>
                  <Input
                    id="username"
                    type="text"
                    placeholder="janedoe"
                    className="pl-7 bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                    required
                    minLength={3}
                    maxLength={30}
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <p className="text-xs text-slate-300">
                  {translate("username_hint")}
                </p>
              </div>

              <Separator className="bg-white/10" />

              {/* ── Credentials ── */}
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                >
                  {translate("email_label")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                >
                  {translate("password_label")}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="your password"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="repeat-password"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                >
                  {translate("confirm_password_label")}
                </Label>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="confirm password"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white/30 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>

              {error && (
                <Alert
                  variant="destructive"
                  className="bg-red-500/10 border-red-500/30 text-red-400"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? translate("creating_account")
                  : translate("sign_up")}
              </Button>
            </div>

            <div className="text-center text-sm text-slate-300 mt-5">
              {translate("already_have_account")}{" "}
              <Link
                href="/auth/login"
                className="ml-1 text-icon/80 hover:text-orange-400 font-bold transition-colors"
              >
                {translate("login")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
