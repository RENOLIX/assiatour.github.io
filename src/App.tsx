import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
import AdminBlocGallerie from "./pages/admin/bloc-gallerie.tsx";
import NotFound from "./pages/NotFound.tsx";
import { getRouterBaseName } from "./lib/site-paths.ts";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <DefaultProviders>
      <BrowserRouter basename={getRouterBaseName()}>
        <ScrollToTop />
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
            <Route path="bloc-gallerie" element={<AdminBlocGallerie />} />
            <Route path="utilisateurs" element={<AdminUtilisateurs />} />
            <Route path="reservations" element={<AdminReservations />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </DefaultProviders>
  );
}
