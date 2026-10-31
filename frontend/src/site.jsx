import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [services, setServices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const reload = useCallback(async () => {
    try {
      const [nextSettings, nextServices, nextGallery] = await Promise.all([
        api("/api/settings"),
        api("/api/services"),
        api("/api/gallery"),
      ]);
      setSettings(nextSettings);
      setServices(Array.isArray(nextServices) ? nextServices : []);
      setGallery(Array.isArray(nextGallery) ? nextGallery : []);
      setError("");
    } catch (err) {
      setError(err.message || "The studio could not be reached");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <SiteContext.Provider value={{ settings, services, gallery, error, ready, reload }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}
