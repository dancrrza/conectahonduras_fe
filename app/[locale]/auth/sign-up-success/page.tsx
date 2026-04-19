"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { CONTENT } from "@/lib/content";

const T = CONTENT.auth.signUpSuccess;
const C = { red: "#D03B27", yellow: "#F5BE2E", cream: "#F0EBE0", black: "#0A0A0A", card: "#111111" };
const F = { body: "var(--font-space-grotesk)", heading: "var(--font-dela-gothic)" };

function SignUpSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const supabase = createClient();

  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

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
    const { error } = await supabase.auth.resend({ type: "signup", email });
    setResendLoading(false);
    if (!error) { setResendSuccess(true); setResendCooldown(60); }
  };

  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 20px 40px" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div style={{ background: C.card, overflow: "hidden" }}>
          {/* Top accent */}
          <div style={{ height: 4, background: C.red }} />

          <div style={{ padding: "40px 36px" }}>
            {/* Badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)", color: "#4ade80", fontSize: 12, fontWeight: 600, padding: "6px 16px", fontFamily: F.body }}>
                ✦ {T.badge}
              </div>
            </div>

            {/* Icon */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ position: "relative", width: 80, height: 80, background: "linear-gradient(135deg, rgba(208,59,39,0.2), rgba(245,190,46,0.2))", border: "1px solid rgba(240,235,224,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={36} strokeWidth={1.5} style={{ color: C.red }} />
                <span style={{ position: "absolute", top: -4, right: -4, width: 14, height: 14, borderRadius: "50%", background: C.red }} />
              </div>
            </div>

            {/* Heading */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1 style={{ fontFamily: F.heading, fontSize: 28, lineHeight: 1, color: C.cream, marginBottom: 12 }}>
                {T.title} <span style={{ color: C.red }}>{T.titleHighlight}</span>
              </h1>
              <p style={{ fontFamily: F.body, fontSize: 14, color: "rgba(240,235,224,0.5)", lineHeight: 1.6, margin: 0 }}>
                {email && <><span style={{ color: C.yellow }}>{email}</span>.<br /></>}
                {T.body}
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: "rgba(240,235,224,0.08)", margin: "0 0 24px" }} />

            {/* Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
              {[T.step1, T.step2, T.step3].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: "rgba(208,59,39,0.2)", border: "1px solid rgba(208,59,39,0.4)", color: C.red, fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.body }}>
                    {i + 1}
                  </div>
                  <p style={{ fontFamily: F.body, fontSize: 13, color: "rgba(240,235,224,0.5)", lineHeight: 1.5, margin: 0 }}>{step}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                href="/auth/login"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px 24px", background: C.red, color: C.cream, fontFamily: F.body, fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}
              >
                {T.cta} <ArrowRight size={16} />
              </Link>

              {email && (
                <button
                  onClick={handleResend}
                  disabled={resendLoading || resendCooldown > 0}
                  style={{ background: "transparent", border: "none", cursor: resendCooldown > 0 ? "not-allowed" : "pointer", fontFamily: F.body, fontSize: 13, color: resendSuccess ? "#4ade80" : "rgba(240,235,224,0.35)", padding: "8px" }}
                >
                  {resendLoading && <Loader2 size={14} style={{ display: "inline", marginRight: 6 }} />}
                  {resendSuccess ? "✓ Email reenviado" : resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : T.resend}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color: "#F0EBE0", padding: 40 }}>Cargando...</div>}>
      <SignUpSuccessContent />
    </Suspense>
  );
}
