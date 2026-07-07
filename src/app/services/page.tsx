import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { ServiceDirectory } from "@/components/nagrik/service-directory";

export default function ServicesPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <ServiceDirectory />
      </main>
      <Footer />
    </div>
  );
}
