import React, { createContext, useContext, useEffect, useState } from "react";
import { getCompany } from "@/api/company.api";

interface BrandTheme {
  primary: string;
  accent: string;
  dark: string;
  light: string;
}

interface ThemeContextType {
  theme: BrandTheme | null;
  updateTheme: (theme: BrandTheme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<BrandTheme | null>(null);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const company = await getCompany();
      if (company?.brandTheme) {
        applyTheme(company.brandTheme);
        setTheme(company.brandTheme);
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
    }
  };

  const applyTheme = (brandTheme: BrandTheme) => {
    const root = document.documentElement;
    
    // Convert hex to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : null;
    };

    const primaryRgb = hexToRgb(brandTheme.primary);
    const darkRgb = hexToRgb(brandTheme.dark);
    const lightRgb = hexToRgb(brandTheme.light);
    const accentRgb = hexToRgb(brandTheme.accent);

    if (primaryRgb) {
      root.style.setProperty("--theme-primary", brandTheme.primary);
      root.style.setProperty("--theme-primary-rgb", primaryRgb);
    }
    if (darkRgb) {
      root.style.setProperty("--theme-dark", brandTheme.dark);
      root.style.setProperty("--theme-dark-rgb", darkRgb);
    }
    if (lightRgb) {
      root.style.setProperty("--theme-light", brandTheme.light);
      root.style.setProperty("--theme-light-rgb", lightRgb);
    }
    if (accentRgb) {
      root.style.setProperty("--theme-accent", brandTheme.accent);
      root.style.setProperty("--theme-accent-rgb", accentRgb);
    }
  };

  const updateTheme = (newTheme: BrandTheme) => {
    applyTheme(newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};





















