import Container from "@/components/ui/container";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Container>
        <section className="py-24">
          <h1 className="text-5xl font-bold">
            Blueseas Marine Consulting
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-gray-600">
            Worldwide Marine Inspection, Audits and Technical Consultancy.
          </p>
        </section>
      </Container>
    </main>
  );
}