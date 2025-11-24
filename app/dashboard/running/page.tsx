import { deleteRunning } from "@/actions/delete/running";
import { getRunnings } from "@/actions/get/running";
import ActionButton from "@/components/ActionButton";
import CreateButton from "@/components/CreateButton";
import RunningMode from "@/components/running/RunningMode";
import { format } from "date-fns";
import Link from "next/link";
import { PiPencilDuotone } from "react-icons/pi";
import { RiDeleteBin6Line } from "react-icons/ri";

const RunningPage = async () => {
  const data = await getRunnings();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.runnings && data.runnings.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Il n'y pas de donnée
          </span>
        ) : (
          <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
            Running
          </span>
        )}

        {/* Create button */}
        <CreateButton page="running" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 text-graphite h-[87.5vh] overflow-y-auto rounded">
        {data.runnings &&
          data.runnings.length > 0 &&
          data.runnings.map((running) => (
            <div
              key={running.id}
              className="bg-white shadow p-3 relative rounded"
            >
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <span className="bg-amber-300 p-2 rounded-full">
                    <RunningMode mode={running.mode} />
                  </span>
                  <span>{format(new Date(running.date), "dd/MM/yyyy")}</span>
                </div>

                <hr className="h-px border-none bg-dust-grey" />

                <div className="flex justify-between">
                  <div className="flex flex-col items-center gap-2 p-1">
                    <span className="font-bold">
                      {Number(running.kilometers)}
                    </span>
                    <span>Kilomètres</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-1">
                    <span className="font-bold">{running.durations}</span>
                    <span>Temps</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 p-1">
                    <span className="font-bold">
                      {Number(running.calories)}
                    </span>
                    <span>Calories</span>
                  </div>
                </div>

                <div className="justify-end flex gap-2">
                  <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                    <Link href={`/dashboard/running/update/${running.id}`}>
                      <PiPencilDuotone size={20} color="orange" />
                    </Link>
                  </div>

                  <ActionButton
                    id={running.id}
                    handler={deleteRunning as (id?: string) => void}
                  >
                    <div className="bg-[rgb(0,0,0,0.1)] hover:bg-[rgb(0,0,0,0.3)] rounded-full p-2 transition">
                      <RiDeleteBin6Line size={20} color="crimson" />
                    </div>
                  </ActionButton>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RunningPage;
