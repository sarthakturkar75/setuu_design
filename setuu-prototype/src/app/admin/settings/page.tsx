"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { useToast } from "@/contexts/ToastContext";
import { updateOrganization } from "@/app/actions/organizationActions";
import { updatePlatformSettings } from "@/app/actions/platformActions";
import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";
import { Save, RefreshCw, Shield, Globe, CreditCard, Building2, AlertTriangle, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function OrganizationSettingsPage() {
	const [activeTab, setActiveTab] = useState<"profile" | "subscription" | "system" | "security">("profile");
	const { success, error, info } = useToast();
	const [loading, setLoading] = useState(false);
	const [orgData, setOrgData] = useState({ name: "Acme Corp", brandColor: "#0ea5e9" });
	const [systemData, setSystemData] = useState({ timezone: "utc", language: "en-us", theme: "system" });
	const [securityData, setSecurityData] = useState({ mfa: true, strictPass: true, sessionTimeout: "1h" });

	const handleSave = async () => {
		setLoading(true);
		try {
			if (activeTab === "profile") {
				const res: any = await updateOrganization("00000000-0000-0000-0000-000000000000", { name: orgData.name });
				if (!res?.success) throw new Error(res?.error);
			} else if (activeTab === "system") {
				const res: any = await updatePlatformSettings(systemData);
				if (!res?.success) throw new Error(res?.error);
			} else if (activeTab === "security") {
				await new Promise(r => setTimeout(r, 600));
			}
			success("Settings Saved", "Your preferences have been updated successfully.");
		} catch (err: any) {
			error("Failed to Save", err.message || "An error occurred.");
		} finally {
			setLoading(false);
		}
	};


	return (
		<div className="flex flex-col h-full bg-surface">
			<PageHeader
				title="Organization Configuration"
				subtitle="Manage global settings, subscription tiers, and security policies for your tenant"
				breadcrumb={
					<div className="flex items-center gap-2 text-sm text-on-surface-variant">
						<Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
						<span>/</span>
						<span className="text-on-surface font-medium">Settings</span>
					</div>
				}
				actions={
					<div className="flex items-center gap-3">
						<button className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface text-on-surface rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">
							<RefreshCw className="w-4 h-4" />
							Discard Changes
						</button>
						<button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors shadow-elevation-l1">
							<Save className="w-4 h-4" />
							{loading ? "Saving..." : "Save Configuration"}
						</button>
					</div>
				}
			/>

			<div className="flex-1 overflow-y-auto p-6 max-w-350 mx-auto w-full flex flex-col lg:flex-row gap-8">

				{/* Settings Navigation Sidebar */}
				<div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
					<button
						onClick={() => setActiveTab("profile")}
						className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "profile" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"}`}
					>
						<Building2 className="w-5 h-5" /> Organization Profile
					</button>
					<button
						onClick={() => setActiveTab("subscription")}
						className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "subscription" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"}`}
					>
						<CreditCard className="w-5 h-5" /> Subscription Oversight
					</button>
					<button
						onClick={() => setActiveTab("system")}
						className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "system" ? "bg-primary/10 text-primary" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"}`}
					>
						<Globe className="w-5 h-5" /> System-Wide Preferences
					</button>
					<button
						onClick={() => setActiveTab("security")}
						className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${activeTab === "security" ? "bg-crimson/10 text-crimson" : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"}`}
					>
						<Shield className="w-5 h-5" /> Security Policy
					</button>
				</div>

				{/* Settings Content Area */}
				<div className="flex-1 flex flex-col gap-6">

					{activeTab === "profile" && (
						<Card className="p-8 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200">
							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold text-on-surface">Organization Profile</h2>
								<p className="text-sm text-on-surface-variant">Update your company name, domain, and branding assets.</p>
							</div>

							<div className="flex flex-col gap-6 max-w-2xl">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-on-surface">Organization Name</label>
									<TextInput defaultValue="Praimo Innovation" placeholder="Enter company name" />
								</div>
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-on-surface">Primary Domain</label>
									<TextInput defaultValue="praimo.com" placeholder="e.g. yourcompany.com" />
									<p className="text-xs text-on-surface-variant">This domain is used for Single Sign-On (SSO).</p>
								</div>

								<div className="flex flex-col gap-2">
									<label className="text-sm font-bold text-on-surface">Organization Type</label>
									<Select
										options={[
											{ label: "General Contractor", value: "gc" },
											{ label: "Architecture Firm", value: "arch" },
											{ label: "Real Estate Developer", value: "dev" },
										]}
										value="gc"
										onChange={() => { }}
									/>
								</div>

								<div className="flex flex-col gap-2 border-t border-outline-variant pt-6 mt-4">
									<h3 className="text-base font-bold text-on-surface">Branding</h3>
									<div className="flex items-center gap-6 mt-2">
										<div className="w-24 h-24 rounded-xl border-2 border-dashed border-outline-variant flex items-center justify-center bg-surface-variant/30 hover:border-primary/50 transition-colors cursor-pointer">
											<span className="text-xs font-semibold text-on-surface-variant text-center px-2">Upload Logo (PNG/SVG)</span>
										</div>
										<div className="flex flex-col gap-2 flex-1">
											<div className="flex flex-col gap-2">
												<label className="text-sm font-semibold text-on-surface">Brand Color (Hex)</label>
												<TextInput value={orgData.brandColor} onChange={e => setOrgData({ ...orgData, brandColor: e.target.value })} placeholder="#FFFFFF" />
											</div>
											<p className="text-xs text-on-surface-variant">This color will be used for emails and external client portals.</p>
										</div>
									</div>
								</div>
							</div>
						</Card>
					)}

					{activeTab === "subscription" && (
						<Card className="p-8 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200">
							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold text-on-surface">Subscription Oversight</h2>
								<p className="text-sm text-on-surface-variant">View your current tier and manage resource limits.</p>
							</div>

							<div className="p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
								<div className="flex flex-col gap-1">
									<span className="text-sm font-bold text-primary uppercase tracking-wider">Current Plan</span>
									<span className="text-3xl font-bold text-on-surface">Enterprise Tier</span>
									<span className="text-sm text-on-surface-variant mt-2">Billed annually on January 1st. Next invoice: $45,000</span>
								</div>
								<button onClick={() => info("Upgrade Request", "A sales representative will contact you shortly.")} className="px-6 py-3 bg-surface border border-outline-variant rounded-lg text-sm font-semibold hover:bg-surface-variant transition-colors">Contact Sales for Upgrade</button>
							</div>

							<div className="flex flex-col gap-4 max-w-2xl mt-4">
								<h3 className="text-base font-bold text-on-surface">Usage Metrics</h3>

								<div className="flex flex-col gap-2">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-on-surface">Active Projects</span>
										<span className="font-jetbrains text-on-surface-variant">42 / Unlimited</span>
									</div>
									<div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
										<div className="h-full bg-primary rounded-full w-[10%]" />
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-4">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-on-surface">Storage Quota</span>
										<span className="font-jetbrains text-on-surface-variant">840 GB / 2 TB</span>
									</div>
									<div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
										<div className="h-full bg-semantic-amber rounded-full w-[42%]" />
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-4">
									<div className="flex justify-between text-sm">
										<span className="font-semibold text-on-surface">Licensed Users</span>
										<span className="font-jetbrains text-on-surface-variant">156 / 200</span>
									</div>
									<div className="w-full h-2 rounded-full bg-surface-variant overflow-hidden">
										<div className="h-full bg-semantic-emerald rounded-full w-[78%]" />
									</div>
								</div>

							</div>
						</Card>
					)}

					{activeTab === "system" && (
						<Card className="p-8 flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-200">
							<div className="flex flex-col gap-2">
								<h2 className="text-xl font-bold text-on-surface">System-Wide Preferences</h2>
								<p className="text-sm text-on-surface-variant">Configure default behaviors across all projects.</p>
							</div>

							<div className="flex flex-col gap-6 max-w-2xl">
								<div className="flex flex-col gap-2">
									<label className="text-sm font-bold text-on-surface">Default Timezone</label>
									<Select
										options={[
											{ label: "UTC (Coordinated Universal Time)", value: "utc" },
											{ label: "EST (Eastern Standard Time)", value: "est" },
											{ label: "PST (Pacific Standard Time)", value: "pst" },
										]}
										value={systemData.timezone} onChange={e => setSystemData({...systemData, timezone: e.target.value})} />
								</div>

								<div className="flex flex-col gap-2">
									<label className="text-sm font-bold text-on-surface">Global Language</label>
									<Select
										options={[
											{ label: "English (US)", value: "en-us" },
											{ label: "Spanish (ES)", value: "es" },
											{ label: "French (FR)", value: "fr" },
										]}
										value={systemData.language} onChange={e => setSystemData({...systemData, language: e.target.value})} />
								</div>

								<div className="flex flex-col gap-2">
									<label className="text-sm font-bold text-on-surface">Default Theme</label>
									<Select
										options={[
											{ label: "System Default", value: "system" },
											{ label: "Light Theme", value: "light" },
											{ label: "Dark Theme", value: "dark" },
										]}
										value={systemData.theme} onChange={e => setSystemData({...systemData, theme: e.target.value})} />
								</div>
							</div>
						</Card>
					)}

					{activeTab === "security" && (
						<Card className="p-8 flex flex-col gap-8 border-crimson/20 animate-in fade-in zoom-in-95 duration-200">
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-2">
									<Shield className="w-6 h-6 text-crimson" />
									<h2 className="text-xl font-bold text-on-surface">Security Policy</h2>
								</div>
								<p className="text-sm text-on-surface-variant">Enforce strict authentication and session controls.</p>
							</div>

							<div className="flex flex-col gap-6 max-w-2xl">

								<div className="p-4 rounded-lg border border-outline-variant bg-surface flex items-start justify-between gap-4 hover:border-primary/50 transition-colors">
									<div className="flex flex-col gap-1">
										<span className="font-bold text-on-surface flex items-center gap-2"><Key className="w-4 h-4" /> Two-Factor Authentication (2FA)</span>
										<span className="text-sm text-on-surface-variant">Require all users and vendors to set up 2FA upon their next login.</span>
									</div>
									<div className="relative inline-block w-12 h-6 rounded-full bg-primary shrink-0 cursor-pointer">
										<span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-6" />
									</div>
								</div>

								<div className="p-4 rounded-lg border border-outline-variant bg-surface flex items-start justify-between gap-4 hover:border-primary/50 transition-colors">
									<div className="flex flex-col gap-1">
										<span className="font-bold text-on-surface">Strict Password Policy</span>
										<span className="text-sm text-on-surface-variant">Require 12+ characters, symbols, numbers, and 90-day rotation.</span>
									</div>
									<div className="relative inline-block w-12 h-6 rounded-full bg-primary shrink-0 cursor-pointer">
										<span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform translate-x-6" />
									</div>
								</div>

								<div className="flex flex-col gap-2 mt-4">
									<label className="text-sm font-bold text-on-surface">Session Idle Timeout</label>
									<Select
										options={[
											{ label: "15 Minutes", value: "15m" },
											{ label: "1 Hour", value: "1h" },
											{ label: "4 Hours", value: "4h" },
											{ label: "Never (Not Recommended)", value: "never" },
										]}
										value={securityData.sessionTimeout} onChange={e => setSecurityData({...securityData, sessionTimeout: e.target.value})} />
									<p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
										<AlertTriangle className="w-3 h-3 text-semantic-amber" />
										Sessions inactive beyond this limit will require re-authentication.
									</p>
								</div>

							</div>
						</Card>
					)}

				</div>

			</div>
		</div>
	);
}
