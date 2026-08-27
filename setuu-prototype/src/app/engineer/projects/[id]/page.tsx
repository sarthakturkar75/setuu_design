import { redirect } from "next/navigation";
import { getRoleLandingPage } from "@/app/actions/roleSettingsActions";

export default async function EngineerProjectRoot({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const target = await getRoleLandingPage(id, "engineer");
  redirect(target);
}
