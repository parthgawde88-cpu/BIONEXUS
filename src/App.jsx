import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FarmerPage from './pages/FarmerPage';
import PashuSakhiPage from './pages/PashuSakhiPage';
import VeterinarianPage from './pages/VeterinarianPage';
import LaboratoryPage from './pages/LaboratoryPage';
import KendraPage from './pages/KendraPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="farmer" element={<FarmerPage />} />
          <Route path="pashu-sakhi" element={<PashuSakhiPage />} />
          <Route path="veterinarian" element={<VeterinarianPage />} />
          <Route path="laboratory" element={<LaboratoryPage />} />
          <Route path="kendra" element={<KendraPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
