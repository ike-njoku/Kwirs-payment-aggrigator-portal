import React from "react";
import LayoutWrapper from "./LayoutWrapper";
import ThemeProvider from "@/context/ThemeProvider";

const layout = ({ children }) => {
  return (
    <ThemeProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </ThemeProvider>
  );
};

export default layout;
