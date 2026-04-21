import { createBrowserRouter } from "react-router";
import { DashboardLayout } from "./components/DashboardLayout";
import { DashboardPage } from "./components/DashboardPage";
import { AnalysisPage } from "./components/AnalysisPage";
import { ReportsPage } from "./components/ReportsPage";
import { SettingsPage } from "./components/SettingsPage";
import { LoginPage } from "./components/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "analysis", Component: AnalysisPage },
      { path: "reports", Component: ReportsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
