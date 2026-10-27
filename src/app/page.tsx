import { Masthead } from "@/components/Masthead";
import { RevealObserver } from "@/components/RevealObserver";
import { AltarChapter } from "@/components/sections/AltarChapter";
import { CodeChapter } from "@/components/sections/CodeChapter";
import { CourtChapter } from "@/components/sections/CourtChapter";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { Practice } from "@/components/sections/Practice";
import { RingChapter } from "@/components/sections/RingChapter";

export default function Home() {
  return (
    <>
      <Masthead />
      <main>
        <Hero />
        <Practice />
        <CodeChapter />
        <CourtChapter />
        <RingChapter />
        <AltarChapter />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
