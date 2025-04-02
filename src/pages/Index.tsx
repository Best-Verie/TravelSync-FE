
import Hero from '@/components/sections/Hero';
import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Stats from '@/components/sections/Stats';
import Courses from '@/components/sections/Courses';
import Cta from '@/components/sections/Cta';
import Registration from '@/components/sections/Registration';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Index() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <About />
        <Stats />
        <Services />
        <Courses />
        <Registration />
        <Cta />
      </main>
      <Footer />
    </div>
  )
}
