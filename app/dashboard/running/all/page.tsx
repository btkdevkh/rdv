import { getRunnings } from "@/actions/get/running";
import CreateButton from "@/components/CreateButton";
import TabLink from "@/components/TabLink";

const RunningAllPage = async () => {
  const data = await getRunnings();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-3">
        {data.runnings && data.runnings.length === 0 ? (
          <span className="bg-green-100 text-green-700 py-2 px-4 rounded">
            Aucune donnée disponible
          </span>
        ) : (
          <div className="flex items-center gap-1">
            <TabLink url="/dashboard/running" title="Par 12" />
            <TabLink url="/dashboard/running/all" title="Toutes" />
          </div>
        )}

        <CreateButton page="running" />
      </div>

      {/* @todo */}
    </div>
  );
};

export default RunningAllPage;
