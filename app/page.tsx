import DotNavigation from "@/components/features/DotNavigation";
import About from "@/components/features/home/About";
import Faq from "@/components/features/home/Faq";
import Hero from "@/components/features/home/Hero";
import HowItWorks from "@/components/features/home/HowItWorks";

export default async function Home() {
  return (
    <main className="relative h-screen w-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar">
      <DotNavigation />

      <section id="home" className="h-screen">
        <Hero />
      </section>

      <section id="about" className="h-screen">
        <About />
      </section>

      <section id="how" className="h-screen">
        <HowItWorks />
      </section>

      <section id="faq" className="h-screen">
        <Faq />
      </section>
    </main>
  );
}
