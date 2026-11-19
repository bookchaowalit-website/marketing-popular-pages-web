import { PopularBoard } from "@/components/popular-board";
import { SAMPLES } from "@/lib/popular-pages";

export default function Home() {
  return <PopularBoard samples={SAMPLES} />;
}
