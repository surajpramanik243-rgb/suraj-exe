import { DataProvider } from './store';
import { AnimatedBackground, LoadingScreen } from './components/AnimatedBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Journey } from './components/Journey';
import { ProjectTracker } from './components/ProjectTracker';
import { Skills } from './components/Skills';
import { Showcase } from './components/Showcase';
import { Ideas } from './components/Ideas';
import { About } from './components/About';
import { Footer } from './components/Footer';

function App() {
  return (
    <DataProvider>
      <LoadingScreen />
      <AnimatedBackground />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Journey />
        <ProjectTracker />
        <Skills />
        <Showcase />
        <Ideas />
        <About />
      </main>
      <Footer />
    </DataProvider>
  );
}

export default App;
