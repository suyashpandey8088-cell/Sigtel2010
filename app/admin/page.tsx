import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getStore, storeDriver } from "@/lib/db";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const store = getStore();
  const [enquiries, projects] = await Promise.all([store.listEnquiries(), store.listProjects(true)]);

  return (
    <div className="min-h-[100svh] bg-navy pt-[calc(var(--header-h)+2rem)]">
      <AdminDashboard
        session={{ email: session.email, name: session.name, role: session.role }}
        initialEnquiries={enquiries}
        initialProjects={projects}
        driver={storeDriver()}
      />
    </div>
  );
}
