import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Portfolio from "@/components/Portfolio";
import Testimonial from "@/components/Testimonial";
import Offer from "@/components/Offer";
import Process from "@/components/Process";
import About from "@/components/About";
import CtaFinal from "@/components/CtaFinal";
import Footer from "@/components/Footer";
import WhatsappFloat from "@/components/WhatsappFloat";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problem />
        <Portfolio />
        <Testimonial />
        <Offer />
        <Process />
        <About />
        <CtaFinal />
      </main>
      <Footer />
      <WhatsappFloat />
    </>
  );
}
