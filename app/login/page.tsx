import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="w-full text-graphite">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col items-center justify-center gap-5">
          <Image
            src="/logo.png"
            width={200}
            height={200}
            alt="logo"
            loading="eager"
          />

          <h2 className="text-4xl font-bold uppercase text-center">
            Daily SaaS
          </h2>
        </div>

        <br />

        <LoginForm />
      </div>
    </div>
  );
}
