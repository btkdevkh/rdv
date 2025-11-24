import { getRunningById } from "@/actions/get/running";
import UpdateRunningForm from "@/components/running/update/UpdateRunningForm";

type UpdateRunningPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UpdateRunningPage({
  params,
}: UpdateRunningPageProps) {
  const { id } = await params;
  const { running } = await getRunningById(id);

  return (
    <div className="w-full text-graphite">
      <UpdateRunningForm running={running} />
    </div>
  );
}
