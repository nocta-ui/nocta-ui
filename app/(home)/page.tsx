import Hero from "@/app/(home)/_components/hero";
import Separator from "@/components/separator";
import CTA from "./_components/cta";
import { Description } from "./_components/description";
import { FAQ } from "./_components/faq";
import Features from "./_components/features";

export default function Home() {
  return (
    <>
      <Hero />
      <Description />
      <Separator />
      <Features />
      <Separator />
      <FAQ />
      <Separator />
      <CTA />
    </>
  );
}
