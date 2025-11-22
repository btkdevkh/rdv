import { getRdvById } from "@/actions/get/rdv";
import UpdateRdvForm from "@/components/rdv/update/UpdateRdvForm";

type UpdateRdvPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UpdateRdvPage({ params }: UpdateRdvPageProps) {
  const { id } = await params;
  const { rdv } = await getRdvById(id);

  return (
    <div className="w-full text-graphite">
      <UpdateRdvForm rdv={rdv} />
    </div>
  );
}
