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
import VeterinarianMyVillagesPage from './pages/VeterinarianMyVillagesPage';
import VeterinarianVillageOverviewPage from './pages/VeterinarianVillageOverviewPage';
import VeterinarianCaseQueuePage from './pages/VeterinarianCaseQueuePage';
import VeterinarianCaseDetailPage from './pages/VeterinarianCaseDetailPage';
import VeterinarianPendingSamplesPage from './pages/VeterinarianPendingSamplesPage';
import VeterinarianSampleResultPage from './pages/VeterinarianSampleResultPage';
import VeterinarianPrescriptionsPage from './pages/VeterinarianPrescriptionsPage';
import VeterinarianKendraInventoryPage from './pages/VeterinarianKendraInventoryPage';
import VeterinarianCaseHistoryPage from './pages/VeterinarianCaseHistoryPage';
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
          
          {/* Veterinarian Module Routes */}
          <Route path="veterinarian" element={<RoleRoute role="VETERINARIAN"><VeterinarianPage /></RoleRoute>} />
          <Route path="veterinarian/villages" element={<RoleRoute role="VETERINARIAN"><VeterinarianMyVillagesPage /></RoleRoute>} />
          <Route path="veterinarian/villages/:villageId" element={<RoleRoute role="VETERINARIAN"><VeterinarianVillageOverviewPage /></RoleRoute>} />
          <Route path="veterinarian/cases" element={<RoleRoute role="VETERINARIAN"><VeterinarianCaseQueuePage /></RoleRoute>} />
          <Route path="veterinarian/cases/:caseId" element={<RoleRoute role="VETERINARIAN"><VeterinarianCaseDetailPage /></RoleRoute>} />
          <Route path="veterinarian/samples" element={<RoleRoute role="VETERINARIAN"><VeterinarianPendingSamplesPage /></RoleRoute>} />
          <Route path="veterinarian/samples/:sampleId" element={<RoleRoute role="VETERINARIAN"><VeterinarianSampleResultPage /></RoleRoute>} />
          <Route path="veterinarian/prescriptions" element={<RoleRoute role="VETERINARIAN"><VeterinarianPrescriptionsPage /></RoleRoute>} />
          <Route path="veterinarian/kendra-inventory" element={<RoleRoute role="VETERINARIAN"><VeterinarianKendraInventoryPage /></RoleRoute>} />
          <Route path="veterinarian/case-history" element={<RoleRoute role="VETERINARIAN"><VeterinarianCaseHistoryPage /></RoleRoute>} />

          <Route path="kendra" element={<RoleRoute role="KENDRA"><KendraPage /></RoleRoute>} />
          <Route path="kendra/samples/:sampleId" element={<RoleRoute role="KENDRA"><KendraSamplePage /></RoleRoute>} />
          <Route path="admin" element={<RoleRoute role="ADMIN"><AdminPage /></RoleRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
