import { getRunnings } from "@/actions/get/running";
import CreateButton from "@/components/CreateButton";
import RunningChart from "@/components/running/RunningChart";
import RunningList from "@/components/running/RunningList";
import RunningRecapChart from "@/components/running/RunningRecapChart";
import TabLink from "@/components/TabLink";
import { IRunning } from "@/types/interfaces/IRunning";

const RunningPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const order = (await searchParams).order;
  const data = await getRunnings();

  const formatRunnings = data?.runnings
    ?.map((r) => ({
      ...r,
      kilometers:
        typeof r.kilometers === "object" && "toNumber" in r.kilometers
          ? ((r.kilometers as any).toNumber() as number)
          : Number(r.kilometers),
      calories:
        r.calories !== undefined && r.calories !== null
          ? "toNumber" in r.calories
            ? r.calories.toNumber()
            : Number(r.calories)
          : Number(r.kilometers) * 68,
      date: String(r.date),
      createdAt:
        r.createdAt instanceof Date
          ? r.createdAt.toISOString()
          : String(r.createdAt),
      durations:
        typeof r.durations === "string" ? r.durations : Number(r.durations),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.runnings && data.runnings.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Aucune donnée disponible
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <TabLink url={`/dashboard/running?order=${1}`} title="Activités" />
            <TabLink
              url={`/dashboard/running?order=${2}`}
              title="Récapitulatif"
            />
          </div>
        )}

        <CreateButton page="running" />
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`flex-3 flex flex-col gap-3 h-[87.5vh] overflow-y-auto overflow-x-hidden rounded ${
            order && Number(order) === 1 ? "pr-3" : ""
          }`}
        >
          {order && Number(order) === 1 && (
            <>
              {chunkArray(formatRunnings ?? [], 12).map((chunk, i) => (
                <div
                  key={i}
                  className="bg-white pb-3 pt-4 px-3 flex flex-col items-center justify-center gap-1 rounded"
                >
                  <span className="text-graphite">
                    <b>Activités :</b> {getRunningYear(chunk)}
                  </span>

                  <RunningChart
                    runnings={(chunk as IRunning[]).sort((a, b) =>
                      a.date?.localeCompare(b?.date)
                    )}
                  />
                </div>
              ))}
            </>
          )}

          {order && Number(order) === 2 && formatRunnings && (
            <div className="bg-white pb-3 pt-4 px-3 flex flex-col items-center justify-center gap-1 rounded">
              <span className="text-graphite">
                <b>Récapitulatif : </b>
                {new Date(formatRunnings[0].date).getFullYear()} -{" "}
                {new Date(
                  formatRunnings[formatRunnings.length - 1].date
                ).getFullYear()}
              </span>
              <br />

              <RunningRecapChart runnings={formatRunnings ?? []} />
            </div>
          )}
        </div>

        {order && Number(order) === 1 && (
          <div className="flex-1 h-[87.5vh] overflow-y-auto overflow-x-hidden rounded pr-3">
            <RunningList runnings={data.runnings ?? []} />
          </div>
        )}
      </div>
    </div>
  );
};

export default RunningPage;

// Helpers
const chunkArray = (array: any[], size: number) => {
  const result: any[] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(
      array.sort((a, b) => b.date?.localeCompare(a?.date)).slice(i, i + size)
    );
  }
  return result;
};

const getRunningYear = (array: any[]) => {
  const years = array.map((arr) => new Date(arr.date).getFullYear());

  if (years.every((y) => y === years[0])) {
    return `${years[0]}`;
  } else {
    const uniqueYears = Array.from(new Set(years)).sort((a, b) => a - b);
    return `${uniqueYears.toString().split(",")[0]} - ${
      uniqueYears.toString().split(",")[1]
    }`;
  }
};
