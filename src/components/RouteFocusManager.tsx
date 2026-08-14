import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface RouteFocusManagerProps {
  children: React.ReactNode;
}

export const RouteFocusManager: React.FC<RouteFocusManagerProps> = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    const mainHeading = document.querySelector<HTMLElement>('main h1, main, #main-content');
    if (mainHeading) {
      if (!mainHeading.hasAttribute('tabIndex')) {
        mainHeading.setAttribute('tabIndex', '-1');
      }
      mainHeading.focus({ preventScroll: true });
    }

    let title = 'CinemaPulse - TV & Movie Explorer';
    if (pathname === '/') {
      title = 'Home | CinemaPulse TV & Media Explorer';
    } else if (pathname.startsWith('/explore')) {
      title = 'Explore Shows | CinemaPulse';
    } else if (pathname.startsWith('/schedule')) {
      title = 'Airing Schedule | CinemaPulse';
    } else if (pathname.startsWith('/reviews')) {
      title = 'Watchlist & Community Reviews | CinemaPulse';
    } else if (pathname.startsWith('/shows/')) {
      title = 'Show Details | CinemaPulse';
    }
    document.title = title;
  }, [pathname]);

  return <>{children}</>;
};
