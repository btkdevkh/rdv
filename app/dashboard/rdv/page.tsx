import { deleteRdv } from "@/actions/delete/rdv";
import { getRdvs } from "@/actions/get/rdv";
import CreateButton from "@/components/CreateButton";
import ActionButton from "@/components/ActionButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import Link from "next/link";
import { PiPencilDuotone } from "react-icons/pi";
import { format } from "date-fns";

const RdvPage = async () => {
  const data = await getRdvs();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.rdvs && data.rdvs.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Il n'y pas de rendez-vous
          </span>
        ) : (
          <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
            Rendez-vous
          </span>
        )}

        {/* Create button */}
        <CreateButton page="rdv" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-graphite">
        {data.rdvs &&
          data.rdvs.length > 0 &&
          data.rdvs.map((rdv) => (
            <div key={rdv.id} className="bg-white shadow p-3 relative rounded">
              <div>
                <h2>Sujet: {rdv.title}</h2>
                <p>Avec: {rdv.withWhom}</p>
                <p>
                  Date: {format(new Date(rdv.date), "dd/MM/yyyy à HH'h'mm")}
                </p>
                <p>Adresse: {rdv.address}</p>
              </div>

              <div className="absolute top-2 right-2 flex flex-col gap-2">
                <ActionButton
                  id={rdv.id}
                  handler={deleteRdv as (id?: string) => void}
                >
                  <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                    <RiDeleteBin6Line size={20} color="crimson" />
                  </div>
                </ActionButton>

                <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                  <Link href={`/dashboard/rdv/update/${rdv.id}`}>
                    <PiPencilDuotone size={20} color="orange" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RdvPage;
