import { InfinityBoard } from "@/components/board/InfinityBoard";
import { BottomBar } from "@/components/layout/BottomBar";

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden relative">
      <InfinityBoard />
      <BottomBar />
    </main>
  );
}
