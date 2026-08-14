import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RouteFocusManager } from './components/RouteFocusManager';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { ShowDetailsPage } from './pages/ShowDetailsPage';
import { SchedulePage } from './pages/SchedulePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <RouteFocusManager>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="shows/:id" element={<ShowDetailsPage />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </RouteFocusManager>
  );
};

export default App;
