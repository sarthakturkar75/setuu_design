import { redirect } from "next/navigation";

export default async function AdminProjectIndexRedirect({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Redirect to the config tab as the default view for the admin project hub
  redirect(`/admin/projects/${id}/config`);
}
