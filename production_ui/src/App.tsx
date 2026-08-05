import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import PublicProductionOrdersPage from "./pages/PublicProductionOrdersPage";
import LoginPage from "./pages/LoginPage";

import AdminHomePage from "./pages/AdminHomePage";
import AdminMachinesPage from "./pages/AdminMachinesPage";
import AdminProductionOrdersPage from "./pages/AdminProductionOrdersPage";

import RequireAuth from "./components/RequireAuth";

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Órdenes de Producción UI (MUI)
          </Typography>

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/acerca">Acerca</Button>
            <Button color="inherit" component={Link} to="/lista">Lista</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/acerca" element={<AboutPage />} />
        <Route path="/lista" element={<PublicProductionOrdersPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminHomePage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/machines"
          element={
            <RequireAuth>
              <AdminMachinesPage />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/production-orders"
          element={
            <RequireAuth>
              <AdminProductionOrdersPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}