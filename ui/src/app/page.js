import Image from "next/image";
import Hero from "./components/hero";
import Features from "./components/features";
import Steps from "./components/steps";
import Footer from "./components/footer";

export default function Home() {
  return (
    <main className="relative bg-black">
      <Hero />
      <Features />
      <Steps />
      <Footer />
    </main>
  );
}
