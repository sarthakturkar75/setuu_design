import { redirect } from "next/navigation";
import { getRoleLandingPage } from "@/app/actions/roleSettingsActions";

export default async function ClientProjectRoot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const target = await getRoleLandingPage(id, "client");
  redirect(target);
}
