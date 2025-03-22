import React, { createContext, useState, useContext } from 'react';

const NavbarHeightContext = createContext();

export const useNavbarHeight = () => useContext(NavbarHeightContext);

export const NavbarHeightProvider = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState(64); // Valor predeterminado

  return (
    <NavbarHeightContext.Provider value={{ navbarHeight, setNavbarHeight }}>
      {children}
    </NavbarHeightContext.Provider>
  );
};