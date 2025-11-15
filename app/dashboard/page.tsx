import { prisma } from "@/lib/prisma";
import PageWrapper from "@/components/PageWrapper";
import PageContainer from "@/components/PageContainer";

export default async function Home() {
  const data = await prisma.rdv.findMany();

  return (
    <PageWrapper>
      <PageContainer>
        <div className="grid md:grid-cols-2 gap-2 text-black">
          {data.length > 0 ? (
            data.map((rdv) => (
              <div key={rdv.id} className="bg-white shadow p-3 rounded">
                <h2>{rdv.title}</h2>
                <p>Avec: {rdv.withWhom}</p>
                <p>Date: {rdv.date}</p>
                <p>Adresse: {rdv.address}</p>
              </div>
            ))
          ) : (
            <div>
              <p className="">Aucun donnée disponible.</p>
            </div>
          )}
        </div>
      </PageContainer>
    </PageWrapper>
  );
}
