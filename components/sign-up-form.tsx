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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-[#152a47] border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.45)] gap-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-[1.75rem] font-extrabold tracking-tight text-slate-100 animate-fade-up">
            Sign up
          </CardTitle>
          <CardDescription className="text-foreground text-sm mb-0">
            Create a new account
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-up">
          <Separator className="bg-white/10 mb-6" />
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-xs font-semibold uppercase tracking-widest text-slate-400"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="your password"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="repeat-password"
                    className="text-xs font-semibold uppercase tracking-widest text-slate-400"
                  >
                    Confirm Password
                  </Label>
                </div>
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="confirm password"
                  className="bg-[#112240] border-white/10 text-slate-100 placeholder-white focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
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
                {isLoading ? "Creating an account..." : "Sign up"}
              </Button>
            </div>
            <div className="text-center text-sm text-slate-400 mt-5">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="ml-1 text-icon hover:text-orange-400 font-bold transition-colors"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
