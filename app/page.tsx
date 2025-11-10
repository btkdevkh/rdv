import PageWrapper from "@/components/PageWrapper";
import PageContainer from "@/components/PageContainer";
import { data } from "@/data/mockedData";

export default function Home() {
  return (
    <PageWrapper>
      <PageContainer>
        <div className="grid gap-2">
          {data.map((rdv) => (
            <div key={rdv.id} className="bg-[#ddd] text-black p-3 rounded">
              <h2>{rdv.title}</h2>
              <p>Avec: {rdv.withWhom}</p>
              <p>Date: {rdv.date}</p>
              <p>Adresse: {rdv.address}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </PageWrapper>
  );
}
