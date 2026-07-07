import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { DocAnalyzer } from "@/components/nagrik/doc-analyzer";

export default function DocsPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <DocAnalyzer />
      </main>
      <Footer />
    </div>
  );
}
