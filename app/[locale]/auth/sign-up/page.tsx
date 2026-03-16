import { SignUpForm } from "@/components/auth/SignUpForm";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full mt-20 justify-center">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  );
}
