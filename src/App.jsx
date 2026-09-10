import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { PanelPrincipal } from "./modules/pages/PanelPrincipal";
import TeacherDashboard from "./modules/pages/TeacherDashboard";
import AvatarCustomizer from "./modules/pages/AvatarCustomizer";
import { preloadKeyAssets } from "./modules/utils/assetPreloader";

function App() {
  useEffect(() => {
    preloadKeyAssets();
  }, []);

  return (
    <BrowserRouter>
      <div>
        <Routes>
          {/* ruta inicial */}
          <Route path="/" element={<Navigate to="/panelprincipal" />} />
          
          {/* demas rutas */}
          <Route path="/panelprincipal" element={<PanelPrincipal />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/avatar" element={<AvatarCustomizer />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
