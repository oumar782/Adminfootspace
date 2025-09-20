import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Page/dashboards";
import MainLayout from "./layout/Mainlayout";
import Client from "./Page/gestion-client";
import Reservation from "./Page/Reservation";
import Terrain from "./Page/Terrain";
import Creneau from "./Page/Crenaux";
import Calendrier from "./Page/calendriers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige "/" vers "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;