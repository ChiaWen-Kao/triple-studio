import { Header } from './components/Header';
import { StudioIntro } from './components/motion/StudioIntro';
import { IdeaJourney } from './components/motion/IdeaJourney';
import { Hero } from './components/Hero';
import { CaseStudies } from './components/cases/CaseStudies';
import { Services } from './components/services/Services';
import { Team } from './components/Team';
import { StudioPortal } from './components/motion/StudioPortal';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Questions } from './components/Questions';

export function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <StudioIntro />
        <IdeaJourney />
        <CaseStudies />
        <Team />
        <StudioPortal />
        <Contact />
        <Questions />
      </main>
      <Footer />
    </>
  );
}
