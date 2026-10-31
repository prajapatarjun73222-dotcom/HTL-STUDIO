import { createContext, useContext } from "react";
import { gallery, services, settings } from "./content";

const SiteContext = createContext({ settings, services, gallery });

export function SiteProvider({ children }) {
  return (
    <SiteContext.Provider value={{ settings, services, gallery }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
