"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(false);
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return (
    <div
      style={{
        transition: "opacity 0.25s cubic-bezier(0, 0, 0.2, 1), transform 0.25s cubic-bezier(0, 0, 0.2, 1)",
      }}
      className={`w-full ${
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1.5"
      }`}
    >
      {children}
    </div>
  );
};

