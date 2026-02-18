import { useState, useEffect } from 'react';

type View = 'dashboard' | 'chat' | 'profile' | 'youtube-script' | 'ai-video-maker' | 'cold-email' | 'ai-image-generator';

export function useHashRoute() {
  const getViewFromHash = (): View => {
    const hash = window.location.hash.slice(1);
    if (hash === 'chat' || hash === 'profile' || hash === 'youtube-script' || hash === 'ai-video-maker' || hash === 'cold-email' || hash === 'ai-image-generator') {
      return hash;
    }
    return 'dashboard';
  };

  const [currentView, setCurrentView] = useState<View>(getViewFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentView(getViewFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (view: View) => {
    window.location.hash = view;
    setCurrentView(view);
  };

  return { currentView, navigate };
}
