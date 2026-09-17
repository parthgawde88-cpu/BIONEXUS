import React from 'react';
import { BrowserRouter, Navigate, Routes, Route, useLocation } from 'react-router-dom';
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
import { useBionexus } from './context';

const ROLE_PATHS = {
  FARMER: '/farmer',
  SEVA_SAKHI: '/pashu-sakhi',
  VETERINARIAN: '/veterinarian',
  KENDRA: '/kendra',
  ADMIN: '/admin',
};

function RoleRoute({ role, children }) {
  const location = useLocation();
  const { sessionUser } = useBionexus();

  if (!sessionUser) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (sessionUser.role !== role) return <Navigate to={ROLE_PATHS[sessionUser.role]} replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="farmer" element={<RoleRoute role="FARMER"><FarmerPage /></RoleRoute>} />
          <Route path="farmer/cases/new" element={<RoleRoute role="FARMER"><FarmerCaseReportPage /></RoleRoute>} />
          <Route path="farmer/cases" element={<RoleRoute role="FARMER"><FarmerCaseHistoryPage /></RoleRoute>} />
          <Route path="pashu-sakhi" element={<RoleRoute role="SEVA_SAKHI"><PashuSakhiPage /></RoleRoute>} />
          <Route path="pashu-sakhi/samples/:sampleId" element={<RoleRoute role="SEVA_SAKHI"><PashuSakhiSamplePage /></RoleRoute>} />
          <Route path="veterinarian" element={<RoleRoute role="VETERINARIAN"><VeterinarianPage /></RoleRoute>} />
          <Route path="veterinarian/cases" element={<RoleRoute role="VETERINARIAN"><VeterinarianCaseQueuePage /></RoleRoute>} />
          <Route path="veterinarian/cases/:caseId" element={<RoleRoute role="VETERINARIAN"><VeterinarianCaseDetailPage /></RoleRoute>} />
          <Route path="veterinarian/samples/:sampleId" element={<RoleRoute role="VETERINARIAN"><VeterinarianSampleResultPage /></RoleRoute>} />
          <Route path="kendra" element={<RoleRoute role="KENDRA"><KendraPage /></RoleRoute>} />
          <Route path="kendra/samples/:sampleId" element={<RoleRoute role="KENDRA"><KendraSamplePage /></RoleRoute>} />
          <Route path="admin" element={<RoleRoute role="ADMIN"><AdminPage /></RoleRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
