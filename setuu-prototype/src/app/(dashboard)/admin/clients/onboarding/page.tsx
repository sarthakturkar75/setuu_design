import { ClientOnboardingForm } from "./ClientOnboardingForm";

export const metadata = {
  title: "Client Onboarding | Setuu",
};

export default function ClientOnboardingPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 w-full pb-20">
      <div className="space-y-4 text-center mb-8">
        <h1 className="text-3xl font-bold font-inter text-on-surface tracking-tight">Client Onboarding</h1>
        <p className="text-on-surface-variant font-inter mt-1 max-w-2xl mx-auto">
          Provision a new client organization in the system before inviting individual client users.
        </p>
      </div>
      <ClientOnboardingForm />
    </div>
  );
}
