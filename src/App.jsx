import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Page/dashboards";
import MainLayout from "./layout/Mainlayout";
import Client from "./Page/gestion-client";
import Reservation from "./Page/Reservation";
import Terrain from "./Page/Terrain";
import Creneau from "./Page/Crenaux";
import Calendrier from "./Page/calendriers";
import User from "./Page/user";
import Contact from "./Page/contact";
import Connexion from "./Page/connexion";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige "/" vers "/connexion" */}
        <Route path="/" element={<Navigate to="/connexion" replace />} />
        
        {/* Route pour la connexion */}
        <Route path="/connexion" element={<Connexion />} />
        
        {/* Routes protégées avec MainLayout */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/reservations"
          element={
            <MainLayout>
              <Reservation />
            </MainLayout>
          }
        />
        
        <Route
          path="/client"
          element={
            <MainLayout>
              <Client />
            </MainLayout>
          }
        />
        <Route
          path="/terrain"
          element={
            <MainLayout>
              <Terrain />
            </MainLayout>
          }
        />
        <Route
          path="/creneaux"
          element={
            <MainLayout>
              <Creneau />
            </MainLayout>
          }
        />
        <Route
          path="/calendrier"
          element={
            <MainLayout>
              <Calendrier />
            </MainLayout>
          }
        />
        <Route
          path="/user"
          element={
            <MainLayout>
              <User />
            </MainLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;