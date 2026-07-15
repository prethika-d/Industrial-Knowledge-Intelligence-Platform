import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Login from "./pages/Login";

import ProtectRoute from "./components/ProtectRoute";

export default function App() {
  return (
    <Routes>

      {/* Login */}

      <Route path="/login" element={<Login />} />

      {/* Protect Routes */}

      <Route
        element={
          <ProtectRoute>
            <Layout />
          </ProtectRoute>
        }
      >
        <Route
          index
          element={<Dashboard />}
        />

        <Route
          path="upload"
          element={<Upload />}
        />

        <Route
          path="assistant"
          element={<AIAssistant />}
        />

        <Route
          path="analytics"
          element={<Analytics />}
        />

        <Route
          path="reports"
          element={<Reports />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" />}
      />

    </Routes>
  );
}