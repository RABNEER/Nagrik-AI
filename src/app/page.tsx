import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { Hero } from "@/components/nagrik/hero";

export default function Home() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
