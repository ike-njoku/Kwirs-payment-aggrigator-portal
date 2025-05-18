"use client";
import React, { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const toggleTheme = (mode) => {
    // setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
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
