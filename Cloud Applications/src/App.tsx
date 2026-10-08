import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Dashboard from '@/components/Dashboard';
import Footer from '@/components/Footer';

type View = 'home' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('home');

  const navigate = (target: View) => {
    setView(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handler = () => navigate('dashboard');
    window.addEventListener('veridian-navigate-dashboard', handler);
    return () => window.removeEventListener('veridian-navigate-dashboard', handler);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#01070b' }}>
      <Navbar onNavigate={navigate} current={view} />

      {view === 'home' ? (
        <>
          <Hero onGetStarted={() => navigate('dashboard')} />
          <Footer />
        </>
      ) : (
        <Dashboard />
      )}
    </div>
  );
}

export default App;
