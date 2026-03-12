import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function Page() {
  return (
    <div className="flex-1 flex items-center justify-center px-5 py-16 relative">
      <div className="relative z-10 w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
