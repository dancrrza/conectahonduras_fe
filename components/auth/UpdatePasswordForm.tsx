"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useTranslate } from "@/i18n/lib/useTranslate";

const PasswordInput = ({
  id,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  id: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) => {
  const translate = useTranslate();
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
        autoComplete="new-password"
        className="
          pr-10 bg-[#112240] border-white/10 text-slate-100 placeholder-slate-500
          focus-visible:ring-blue-500/40 focus-visible:border-blue-500
          disabled:opacity-50
        "
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow((s) => !s)}
        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-300 hover:text-slate-200 hover:bg-transparent"
        aria-label={
          show ? translate("hide_password") : translate("show_password")
        }
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </Button>
    </div>
  );
};

const StrengthBar = ({ password }: { password: string }) => {
  const translate = useTranslate();

  const score = [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter((r) =>
    r.test(password),
  ).length;

  const labels = [
    "",
    translate("strength_weak"),
    translate("strength_fair"),
    translate("strength_good"),
    translate("strength_strong"),
  ];
  const colors = [
    "",
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-500",
  ];

  if (!password) return null;

  return (
    <div className="space-y-1.5 mt-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= score ? colors[score] : "bg-white/10",
            )}
          />
        ))}
      </div>
      <p
        className={cn(
          "text-xs font-medium",
          score <= 1
            ? "text-red-400"
            : score === 2
              ? "text-orange-400"
              : score === 3
                ? "text-yellow-400"
                : "text-green-400",
        )}
      >
        {labels[score]}
      </p>
    </div>
  );
};

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const translate = useTranslate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
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
        <Card className="bg-[#152a47] border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-orange-500" />

          <CardContent className="pt-10 pb-8 px-10">
            <div className="ch-fade-up">
              <div className="flex justify-center mb-8 animate-fade-up">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-1">
                  <span className="text-[10px]">✦</span>{" "}
                  {translate("almost_there")}
                </div>
              </div>

              {/* Shield icon */}
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-orange-500/20 border border-white/10 mb-6 mx-auto">
                <ShieldCheck
                  className="text-orange-400"
                  size={36}
                  strokeWidth={1.5}
                />
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-orange-500" />
                </span>
              </div>

              {/* Heading */}
              <div className="text-center mb-7">
                <h1 className="text-3xl font-extrabold tracking-tight mb-2">
                  {translate("reset_your")}
                  <span className="text-blue-400">
                    {translate("password_dot")}
                  </span>
                </h1>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {translate("enter_new_password")}
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
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-widest text-slate-300 mb-2"
                  >
                    {translate("new_password_label")}
                  </Label>
                  <PasswordInput
                    id="password"
                    placeholder={translate("new_password_placeholder")}
                    value={password}
                    onChange={setPassword}
                    disabled={isLoading}
                  />
                  <StrengthBar password={password} />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full"
                >
                  {isLoading && (
                    <Loader2 size={18} className="animate-spin mr-2" />
                  )}
                  {isLoading
                    ? translate("saving")
                    : translate("save_new_password")}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
