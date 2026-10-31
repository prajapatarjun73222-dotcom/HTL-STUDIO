import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { SiteProvider } from "./site";
import { Home } from "./pages/Home";

export default function App() {
  return (
    <SiteProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="work" element={<Navigate to="/#work" replace />} />
          <Route path="services" element={<Navigate to="/#services" replace />} />
          <Route path="visit" element={<Navigate to="/#visit" replace />} />
        </Route>
      </Routes>
    </SiteProvider>
  );
}
