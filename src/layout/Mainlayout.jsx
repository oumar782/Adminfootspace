import { ReactNode, useState } from "react";

import Sidebar from "../composant/Sidebar";
import Navbar from "../composant/Navbar";
import "/src/layout/Mainlayout.css";
 

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-20" : "ml-64"}`}>
          <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
  );
};

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t text-xs text-muted-foreground flex items-center justify-between">
      <div>
        <p>© 2025 FootSpace Solutions. Tous droits réservés.</p>
      </div>
      <div className="flex items-center gap-4">
        <p>v1.0.0</p>
        <a href="#" className="hover:text-footspace-600 transition-colors">Conditions d'utilisation</a>
        <a href="#" className="hover:text-footspace-600 transition-colors">Confidentialité</a>
      </div>
    </footer>
  );
};

export default MainLayout;