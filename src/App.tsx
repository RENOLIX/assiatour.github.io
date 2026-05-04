import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DefaultProviders } from "./components/providers/default.tsx";
import AuthCallback from "./pages/auth/Callback.tsx";
import Index from "./pages/Index.tsx";
import VoyagesPage from "./pages/voyages/page.tsx";
import TripPage from "./pages/trip/page.tsx";
import AProposPage from "./pages/a-propos/page.tsx";
import ReservationPage from "./pages/reservation/page.tsx";
import ContactPage from "./pages/contact/page.tsx";
import AdminLayout from "./pages/admin/layout.tsx";
import AdminDashboard from "./pages/admin/index.tsx";
import AdminVoyages from "./pages/admin/voyages.tsx";
import AdminUtilisateurs from "./pages/admin/utilisateurs.tsx";
import AdminReservations from "./pages/admin/reservations.tsx";
import NotFound from "./pages/NotFound.tsx";

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/voyages" element={<VoyagesPage />} />
          <Route path="/voyage/:slug" element={<TripPage />} />
          <Route path="/a-propos" element={<AProposPage />} />
          <Route path="/reservation" element={<ReservationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="voyages" element={<AdminVoyages />} />
            <Route path="utilisateurs" element={<AdminUtilisateurs />} />
            <Route path="reservations" element={<AdminReservations />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
