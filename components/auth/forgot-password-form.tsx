"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useState } from "react";
import { KeyRound, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { translate } from "@/lib/translate";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
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
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSuccess(true);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : translate('an_error_occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-16 relative">
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-[#152a47] border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500" />

          <CardContent className="pt-10 pb-8 px-10">
            {success ? (
              <div className="text-center space-y-4 ch-fade-up py-2">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-8">
                  <span className="text-[10px]">✦</span> {translate('email_sent')}
                </div>
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-green-500/10 border border-green-500/20 mx-auto mb-6">
                  <CheckCircle2
                    className="text-green-400"
                    size={38}
                    strokeWidth={1.5}
                  />
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight pt-1">
                  {translate('check_your')}<span className="text-blue-400">{translate('email_exclamation')}</span>
                </h2>

                <p className="text-slate-300 text-sm leading-relaxed">
                  {translate('password_reset_email_sent')}
                  <span className="text-orange-400 font-semibold ml-2">
                    {email}
                  </span>
                  .
                  <br />
                  {translate('check_spam_folder')}
                </p>

                <Button asChild className="w-full">
                  <Link href="/auth/login">{translate('back_to_login')}</Link>
                </Button>
              </div>
            ) : (
              /* ── FORM STATE ── */
              <div className="ch-fade-up">
                <div className="flex justify-center mb-8 animate-fade-up">
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-1">
                    <span className="text-[10px]">✦</span> {translate('password_recovery')}
                  </div>
                </div>

                {/* Key icon */}
                <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/10 mb-6 mx-auto">
                  <KeyRound
                    className="text-orange-400"
                    size={36}
                    strokeWidth={1.5}
                  />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-blue-500" />
                  </span>
                </div>

                {/* Heading */}
                <div className="text-center mb-7">
                  <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                    {translate('reset_your')}<span className="text-blue-400">{translate('password_dot')}</span>
                  </h1>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {translate('reset_password_instructions')}
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
                      className="text-xs font-semibold uppercase tracking-widest text-slate-300"
                    >
                      {translate('email_label')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      autoComplete="email"
                      className="
                            bg-[#112240] border-white/10 text-slate-100 placeholder-slate-500
                            focus-visible:ring-blue-500/40 focus-visible:border-blue-500
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
                    {isLoading ? translate('sending') : translate('send_reset_email')}
                  </Button>

                  <div className="text-center text-sm text-slate-300 pt-1">
                    {translate('already_have_account')}{" "}
                    <Link
                      href="/auth/login"
                      className="text-blue-400 hover:text-orange-400 font-bold transition-colors"
                    >
                      {translate('login')}
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
