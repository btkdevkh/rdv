import { getPasswordById } from "@/actions/get/password";
import UpdatePasswordForm from "@/components/password/update/UpdatePasswordForm";

type UpdatePasswordPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UpdatePasswordPage({
  params,
}: UpdatePasswordPageProps) {
  const { id } = await params;
  const { password, decryptedPassword } = await getPasswordById(id);

  return (
    <div className="w-full text-graphite">
      <UpdatePasswordForm
        password={password}
        decryptedPassword={decryptedPassword}
      />
    </div>
  );
}
