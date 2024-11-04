import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import Home from '@/pages/Home';
import CreateCampaign from '@/pages/CreateCampaign';
import CampaignDetails from '@/pages/CampaignDetails';
import ProtectedRoute from '@/routes/ProtectedRoutes';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateCampaign />
          </ProtectedRoute>
        }
      />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
    </Routes>
  );
};

export default AppRoutes;
