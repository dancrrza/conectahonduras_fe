"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const EnvelopeIcon = () => (
  <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/10 mb-6 mx-auto">
    <Mail className="text-orange-400" size={36} strokeWidth={1.5} />
    <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500" />
    </span>
  </div>
);

const Step = ({
  number,
  text,
  delay,
}: {
  number: string;
  text: string;
  delay: string;
}) => (
  <div
    className="flex items-start gap-3 animate-fade-up"
    style={{ animationDelay: delay }}
  >
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
      {number}
    </div>
    <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
  </div>
);

function SignUpSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const supabase = createClient();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setResendLoading(true);
    setResendSuccess(false);
    setResendError(null);

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
    });
    setResendLoading(false);
    if (!error) {
      setResendSuccess(true);
      setResendCooldown(60);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-5 py-16 relative">
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-[#152a47] border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500" />

          <CardContent className="pt-10 pb-8 px-10">
            {/* Badge */}
            <div className="flex justify-center mb-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-semibold px-4 py-1.5 rounded-full">
                <span className="text-[10px]">✦</span> Account created
              </div>
            </div>

            {/* Envelope */}
            <div
              className="animate-fade-up"
              style={{ animationDelay: "0.05s" }}
            >
              <EnvelopeIcon />
            </div>

            {/* Heading */}
            <div
              className="text-center animate-fade-up"
              style={{ animationDelay: "0.1s" }}
            >
              <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                Thank you for <span className="text-blue-400">signing up!</span>
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                {email ? (
                  <>
                    We sent a confirmation link to{" "}
                    <span className="text-orange-400 font-semibold">
                      {email}
                    </span>
                    .
                    <br />
                  </>
                ) : (
                  <>
                    We sent a confirmation link to your email address.
                    <br />
                  </>
                )}
                Please check your inbox to activate your account.
              </p>
            </div>

            {/* Divider */}
            <div
              className="my-7 h-px bg-white/10 animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            />

            {/* Steps */}
            <div className="space-y-3.5 mb-8">
              <Step
                number="1"
                text="Open the email we sent you."
                delay="0.2s"
              />
              <Step
                number="2"
                text='Click the "Confirm your email" button inside.'
                delay="0.25s"
              />
              <Step
                number="3"
                text="You'll be redirected to Conecta — ready to explore!"
                delay="0.3s"
              />
            </div>

            {/* CTA */}
            <div
              className="space-y-3 animate-fade-up"
              style={{ animationDelay: "0.35s" }}
            >
              <Button asChild className="w-full">
                <a href="/auth/login">
                  Go to Sign In <ArrowRight size={18} />
                </a>
              </Button>

              {/* Resend — only shown if email is present in URL */}
              {email && (
                <div className="space-y-1">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={resendLoading || resendCooldown > 0}
                    onClick={handleResend}
                    className={cn(
                      "w-full text-sm font-semibold transition-colors",
                      resendSuccess
                        ? "text-green-400 hover:text-green-300"
                        : "text-slate-300 hover:text-slate-200",
                    )}
                  >
                    {resendLoading ? (
                      <Loader2 size={14} className="animate-spin mr-2" />
                    ) : null}
                    {resendSuccess
                      ? "✓ Email resent successfully!"
                      : resendCooldown > 0
                        ? `Resend available in ${resendCooldown}s`
                        : "Didn't receive it? Resend email"}
                  </Button>
                  {resendError && (
                    <p className="text-center text-xs text-red-400">
                      {resendError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpSuccessContent />
    </Suspense>
  );
}
