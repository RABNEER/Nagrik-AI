import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { ScamShield } from "@/components/nagrik/scam-shield";

export default function ScamPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <ScamShield />
      </main>
      <Footer />
    </div>
  );
}
