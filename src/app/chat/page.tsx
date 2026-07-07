import { Header } from "@/components/nagrik/header";
import { Footer } from "@/components/nagrik/footer";
import { ChatCompanion } from "@/components/nagrik/chat-companion";

export default function ChatPage() {
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      <main className="flex flex-1 flex-col">
        <ChatCompanion />
      </main>
      <Footer />
    </div>
  );
}
