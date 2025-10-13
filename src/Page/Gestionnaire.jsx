import { Routes, Route } from "react-router-dom";
import MainLayouts from "../gestimain/mainl";
import GestionRe from "../gestionnaire/gestionreservation";
import GestionCr from "../gestimain/gesticreneau";
import GestionCa from "../gestionnaire/suivical";
import GestionCl from "../gestionnaire/client";

const Gestionnaire = () => {
  return (
    <MainLayouts>
      <Routes>
        {/* Route pour Gestion-reservations dans l'interface gestionnaire */}
        <Route path="Gestion-reservations" element={<GestionRe />} />
        <Route path="Gestion-creneau" element={<GestionCr />} />
        <Route path="suivi-calendrier" element={<GestionCa />} />
        <Route path="gestion-client" element={<GestionCl />} />
      </Routes>
    </MainLayouts>
  );
};

export default Gestionnaire;