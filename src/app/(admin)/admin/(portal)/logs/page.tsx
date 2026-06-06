import type { Metadata } from "next";
import { LogsView } from "@/components/admin/logs/logs-view";

export const metadata: Metadata = {
  title: "Logs · Admin",
};

export default function AdminLogsPage() {
  return <LogsView />;
}
