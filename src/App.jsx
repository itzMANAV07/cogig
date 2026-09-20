import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './lib/appState';
import { LanguageProvider } from './lib/i18n/LanguageContext';

import RoleSelect from './pages/RoleSelect';
import CustomerAuth from './pages/CustomerAuth';
import OtpVerify from './pages/OtpVerify';
import CustomerHome from './pages/CustomerHome';
import CustomerBookings from './pages/CustomerBookings';
import CustomerSupport from './pages/CustomerSupport';
import CustomerAccount from './pages/CustomerAccount';
import SelectService from './pages/SelectService';
import PostRequirement from './pages/PostRequirement';

import WorkerDashboard from './pages/WorkerDashboard';
import WorkerJobs from './pages/WorkerJobs';
import WorkerSupport from './pages/WorkerSupport';
import WorkerAccount from './pages/WorkerAccount';

import CoopAdminAuth from './pages/CoopAdminAuth';
import CoopAdminDashboard from './pages/CoopAdminDashboard';
import CoopAdminWorkers from './pages/CoopAdminWorkers';
import CoopAdminTickets from './pages/CoopAdminTickets';
import CoopAdminAccount from './pages/CoopAdminAccount';

export default function App() {
  return (
    <LanguageProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            {/* Role Selection */}
            <Route path="/" element={<RoleSelect />} />

            {/* Customer Flow (Urban Company Mobile Experience) */}
            <Route path="/customer/login" element={<CustomerAuth />} />
            <Route path="/customer/otp" element={<OtpVerify />} />
            <Route path="/customer/home" element={<CustomerHome />} />
            <Route path="/customer/bookings" element={<CustomerBookings />} />
            <Route path="/customer/support" element={<CustomerSupport />} />
            <Route path="/customer/account" element={<CustomerAccount />} />
            <Route path="/customer/services" element={<SelectService />} />
            <Route path="/customer/post-requirement" element={<PostRequirement />} />
            <Route path="/customer/category" element={<Navigate to="/customer/home" replace />} />
            <Route path="/rwa/dashboard" element={<Navigate to="/customer/bookings" replace />} />

            {/* Worker Flow (4 Tabs: Home, Jobs & Pay, Support, Account) */}
            <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            <Route path="/worker/jobs" element={<WorkerJobs />} />
            <Route path="/worker/support" element={<WorkerSupport />} />
            <Route path="/worker/account" element={<WorkerAccount />} />
            <Route path="/worker/earnings" element={<Navigate to="/worker/jobs" replace />} />

            {/* Cooperative Admin Flow (4 Tabs: Home, Workers, Tickets, Account) */}
            <Route path="/coop-admin/login" element={<CoopAdminAuth />} />
            <Route path="/coop-admin/dashboard" element={<CoopAdminDashboard />} />
            <Route path="/coop-admin/workers" element={<CoopAdminWorkers />} />
            <Route path="/coop-admin/tickets" element={<CoopAdminTickets />} />
            <Route path="/coop-admin/account" element={<CoopAdminAccount />} />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </LanguageProvider>
  );
}
