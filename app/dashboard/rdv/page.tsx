import { getRdvs } from "@/actions/get/rdv";
import CreateButton from "@/components/CreateButton";
import PageWrapper from "@/components/PageWrapper";

const RdvPage = async () => {
  const data = await getRdvs();

  return (
    <PageWrapper>
      <div className="p-3">
        <div className="flex justify-between items-center">
          {data.rdvs && data.rdvs.length === 0 ? (
            <div>
              <mark>Il n'y pas de rendez-vous.</mark>
            </div>
          ) : (
            <span className="text-graphite font-semibold uppercase border-b-2 border-stormy-teal">
              Rdvs
            </span>
          )}

          {/* Create button */}
          <CreateButton page="rdv" />
        </div>

        <br />

        <div className="grid md:grid-cols-4 gap-2 text-black">
          {data.rdvs &&
            data.rdvs.length > 0 &&
            data.rdvs.map((rdv) => (
              <div key={rdv.id} className="bg-white shadow p-3 rounded">
                <h2>{rdv.title}</h2>
                <p>Avec: {rdv.withWhom}</p>
                <p>Date: {rdv.date}</p>
                <p>Adresse: {rdv.address}</p>
              </div>
            ))}
        </div>
      </div>
    </PageWrapper>
  );
};

export default RdvPage;
