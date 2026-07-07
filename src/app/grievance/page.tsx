import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { GrievanceReport } from "@/components/nagrik/grievance-report";

export default function GrievancePage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <GrievanceReport />
      </main>
      <Footer />
    </div>
  );
}
