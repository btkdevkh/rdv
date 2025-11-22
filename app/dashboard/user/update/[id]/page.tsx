import { getUserById } from "@/actions/get/user";
import UpdateUserForm from "@/components/user/update/UpdateUserForm";

type UpdateUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UpdateUserPage({ params }: UpdateUserPageProps) {
  const { id } = await params;
  const { user } = await getUserById(id);

  return (
    <div className="w-full text-graphite">
      <UpdateUserForm user={user} />
    </div>
  );
}
