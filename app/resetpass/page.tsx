import ResetPassForm from "@/components/auth/ResetPassForm";
import Image from "next/image";

export default async function ResetPassPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const token = (await searchParams).token;
  console.log(token);

  return (
    <div className="w-full text-graphite">
      <div className="flex flex-col gap-10">
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

        <ResetPassForm token={token} />
      </div>
    </div>
  );
}
