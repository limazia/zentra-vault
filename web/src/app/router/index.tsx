import { Routes, Route, Navigate } from "react-router-dom";

import { AuthLayout, DashboardLayout } from "@/app/layouts";
import { ProtectedRoute } from "@/shared/components/protected-route";
import { VaultRequiredRoute } from "@/shared/components/vault-required-route";

import { LoginPage, GithubCallbackPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { FoldersPage, FolderDetailPage } from "@/features/folders";
import { FileEditorPage } from "@/features/env";
import { AuditPage } from "@/features/audit";
import { SettingsPage } from "@/features/settings";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/integrations/github"
          element={<GithubCallbackPage />}
        />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <VaultRequiredRoute>
              <DashboardPage />
            </VaultRequiredRoute>
          }
        />
        <Route
          path="/folders"
          element={
            <VaultRequiredRoute>
              <FoldersPage />
            </VaultRequiredRoute>
          }
        />
        <Route
          path="/folders/:folderId"
          element={
            <VaultRequiredRoute>
              <FolderDetailPage />
            </VaultRequiredRoute>
          }
        />
        <Route
          path="/folders/:folderId/file/:fileId"
          element={
            <VaultRequiredRoute>
              <FileEditorPage />
            </VaultRequiredRoute>
          }
        />
        <Route
          path="/audit"
          element={
            <VaultRequiredRoute>
              <AuditPage />
            </VaultRequiredRoute>
          }
        />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
