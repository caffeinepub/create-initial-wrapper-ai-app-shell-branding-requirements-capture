import { useState, useEffect } from 'react';

type View =
  | 'dashboard'
  | 'chat'
  | 'profile'
  | 'youtube-script'
  | 'ai-video-maker'
  | 'cold-email'
  | 'ai-image-generator'
  | 'payment-success'
  | 'payment-failure'
  | 'admin-panel';

export type RouteKey = View;

const VALID_VIEWS: View[] = [
  'dashboard',
  'chat',
  'profile',
  'youtube-script',
  'ai-video-maker',
  'cold-email',
  'ai-image-generator',
  'payment-success',
  'payment-failure',
  'admin-panel',
];

export function useHashRoute() {
  const getViewFromHash = (): View => {
    // Strip leading '#' then take only the path part before '?'
    const hash = window.location.hash.slice(1);
    const pathPart = hash.split('?')[0];
    if (VALID_VIEWS.includes(pathPart as View)) {
      return pathPart as View;
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
