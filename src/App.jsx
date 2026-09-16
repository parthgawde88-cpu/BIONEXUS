import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import FarmerPage from './pages/FarmerPage';
import FarmerCaseReportPage from './pages/FarmerCaseReportPage';
import FarmerCaseHistoryPage from './pages/FarmerCaseHistoryPage';
import PashuSakhiPage from './pages/PashuSakhiPage';
import PashuSakhiSamplePage from './pages/PashuSakhiSamplePage';
import VeterinarianPage from './pages/VeterinarianPage';
import VeterinarianCaseQueuePage from './pages/VeterinarianCaseQueuePage';
import VeterinarianCaseDetailPage from './pages/VeterinarianCaseDetailPage';
import VeterinarianSampleResultPage from './pages/VeterinarianSampleResultPage';
import KendraPage from './pages/KendraPage';
import KendraSamplePage from './pages/KendraSamplePage';
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
          <Route path="farmer/cases/new" element={<FarmerCaseReportPage />} />
          <Route path="farmer/cases" element={<FarmerCaseHistoryPage />} />
          <Route path="pashu-sakhi" element={<PashuSakhiPage />} />
          <Route path="pashu-sakhi/samples/:sampleId" element={<PashuSakhiSamplePage />} />
          <Route path="veterinarian" element={<VeterinarianPage />} />
          <Route path="veterinarian/cases" element={<VeterinarianCaseQueuePage />} />
          <Route path="veterinarian/cases/:caseId" element={<VeterinarianCaseDetailPage />} />
          <Route path="veterinarian/samples/:sampleId" element={<VeterinarianSampleResultPage />} />
          <Route path="kendra" element={<KendraPage />} />
          <Route path="kendra/samples/:sampleId" element={<KendraSamplePage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
