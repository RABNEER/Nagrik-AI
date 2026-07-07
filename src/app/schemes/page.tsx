import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { SchemeRecommender } from "@/components/nagrik/scheme-recommender";

export default function SchemesPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <SchemeRecommender />
      </main>
      <Footer />
    </div>
  );
}
