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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/");
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
            Sign In to <span className="text-icon">Conecta</span>
          </CardTitle>
          <CardDescription className="text-foreground text-sm">
            Explore what's happening around you today.
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-fade-up">
          <Separator className="bg-white/10 mb-6" />
          <form onSubmit={handleLogin}>
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
                  placeholder="your@email.com"
                  className="bg-[#112240] border-white/10 text-slate-100 focus-visible:ring-blue-500/40 focus-visible:border-blue-500"
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
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-slate-400"
                  >
                    Forgot your password?
                  </Link>
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
              {error && <p className="text-sm text-red-500 mb-0">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
          <p className="text-center text-sm text-slate-400 mt-5">
            New here?
            <Link
              href="/auth/sign-up"
              className="ml-1 text-icon hover:text-orange-400 font-bold transition-colors"
            >
              Create a free account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
