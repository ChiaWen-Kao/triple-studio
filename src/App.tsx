import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Services } from './components/services/Services';
import { Process } from './components/Process';
import { Team } from './components/Team';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { Cursor } from './components/Cursor';

export function App() {
  return (
    <>
      <Cursor />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Process />
        <Team />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
