import { Dumbbell } from "lucide-react";
import { Button } from "./ui/button";
import { Form } from "@remix-run/react";
import { Discord, Google } from "./Svg";

interface SocialButtonProps {
  label: string;
  provider: "google" | "discord";
  className?: string;
}

const SocialButton = ({ provider, label, className }: SocialButtonProps) => (
  <Form action={`/auth/${provider}`} method="post" className="w-full">
    <Button
      className={`w-full h-11 flex items-center justify-center gap-4 px-4 py-2 border border-gray-300 rounded-md ${className}`}
    >
      {provider === "google" && <Google />}
      {provider === "discord" && <Discord />}
      <span>{label}</span>
    </Button>
  </Form>
);

interface LoginProps {
  title: string;
}

export default function Login({ title }: LoginProps) {
  return (
    <div className="flex items-center flex-col justify-center">
      <div className="w-80 flex flex-col items-center">
        <Dumbbell size={48} strokeWidth={1} className="mb-4" />
        <div className="font-semibold text-2xl mb-9">{title}</div>
        <div className="flex flex-col items-center w-full gap-3 text-sm">
          <SocialButton provider="google" label="Continue with Google" />
          <SocialButton provider="discord" label="Continue with Discord" />
        </div>
      </div>
    </div>
  );
}
