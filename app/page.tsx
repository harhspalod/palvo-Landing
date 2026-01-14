import { Navbar } from "@/components/navbar"
import { MobileAppShowcase } from "@/components/mobile-app"
import { PreLaunchHighlights } from "@/components/pre-launch-highlights"
import { MultiAgentCrew } from "@/components/multi-agent-crew"
import { DemoVideo } from "@/components/demo-video"
import { UseCases } from "@/components/use-cases"
import { Testimonials } from "@/components/testimonials"
import { ScheduleDemo } from "@/components/schedule-demo"
import { FAQ } from "@/components/faq"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import PalvoHero from "@/components/palvo-hero"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ScrollProgress />
      <Navbar />
      <PalvoHero />

      <div id="vision">
        <PreLaunchHighlights />
      </div>
      <div id="intelligence">
        <MultiAgentCrew />
      </div>
      <div id="product">
        <MobileAppShowcase />
      </div>
      <DemoVideo />
      <UseCases />
      <Testimonials />
      <div id="Demo">
        <ScheduleDemo />

      </div>
      <FAQ />
      <div id="waitlist">
        <CTA />
      </div>
      <Footer />
    </main>
  )
}
