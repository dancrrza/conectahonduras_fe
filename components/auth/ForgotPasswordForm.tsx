"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useState } from "react";
import { KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useTranslate } from "@/i18n/lib/useTranslate";
import { ROUTES } from "@/lib/routes";

export function ForgotPasswordForm({
  className,
}: React.ComponentPropsWithoutRef<"div">) {
  const translate = useTranslate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}${ROUTES.auth.updatePassword}`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : translate("an_error_occurred"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative">
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-card border-border shadow-lg overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500" />

          <CardContent>
            {success ? (
              <div className="text-center space-y-4 ch-fade-up py-2">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
                  <span className="text-[10px]">✦</span>{" "}
                  {translate("email_sent")}
                </div>
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 mx-auto mb-6">
                  <CheckCircle2
                    className="text-green-400"
                    size={38}
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight pt-1">
                  {translate("check_your")}
                  <span className="text-primary">
                    {translate("email_exclamation")}
                  </span>
                </h2>

                <p className="text-muted-foreground text-sm leading-relaxed">
                  {translate("password_reset_email_sent")}
                  <span className="text-orange-400 font-semibold ml-2">
                    {email}
                  </span>
                  .
                  <br />
                  {translate("check_spam_folder")}
                </p>

                <Button asChild className="w-full">
                  <Link href={ROUTES.auth.login}>
                    {translate("back_to_login")}
                  </Link>
                </Button>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <div className="ch-fade-up">
                <div className="flex justify-center mb-8 animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-1">
                    <span className="text-[10px]">✦</span>{" "}
                    {translate("password_recovery")}
                  </div>
                </div>

                {/* Key icon */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-amber-500/20 border border-border mb-6 mx-auto">
                  <KeyRound
                    className="text-orange-400"
                    size={36}
                    strokeWidth={1.5}
                  />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary" />
                  </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-7">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    {translate("reset_your")}
                    <span className="text-primary">
                      {translate("password_dot")}
                    </span>
                  </h1>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {translate("reset_password_instructions")}
                  </p>
                </div>

                <form
                  onSubmit={handleForgotPassword}
                  className="space-y-5"
                  noValidate
                >
                  {error && (
                    <Alert
                      variant="destructive"
                      className="bg-red-500/10 border-red-500/30 text-red-400"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="email"
                      className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      {translate("email_label")}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={translate("email_placeholder")}
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      className="
                            bg-background border-border text-foreground placeholder-muted-foreground
                            focus-visible:ring-ring/50
                            disabled:opacity-50
                          "
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full"
                  >
                    {isLoading && (
                      <Loader2 size={18} className="animate-spin mr-2" />
                    )}
                    {isLoading
                      ? translate("sending")
                      : translate("send_reset_email")}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground pt-1">
                    {translate("already_have_account")}{" "}
                    <Link
                      href={ROUTES.auth.login}
                      className="text-primary hover:text-primary/80 font-bold transition-colors"
                    >
                      {translate("login")}
                    </Link>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
