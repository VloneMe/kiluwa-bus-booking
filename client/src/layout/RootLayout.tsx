import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Footer from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";

export const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <a href="#main-content" className="app-skip-link">
        Ruka hadi maudhui makuu
      </a>

      <Navbar />

      <main
        id="main-content"
        className="app-main"
        role="main"
        tabIndex={-1}
        aria-label="Maudhui kuu"
      >
        <Outlet />
      </main>

      <Footer />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};
