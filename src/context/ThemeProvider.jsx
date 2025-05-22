"use client";
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const themeInStorage =
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"; // Fixed: Added check for window
  const [theme, setTheme] = useState(themeInStorage); // Fixed: Initialize with themeInStorage
  const toggleTheme = (mode) => {
    setTheme(mode);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === "light" ? "dark" : "light");
    root.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const values = {
    theme,
    toggleTheme,
  };
  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};

export default ThemeProvider;
