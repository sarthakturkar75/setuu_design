"use client";

import * as React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserById, updateUserProfile } from "@/app/actions/userActions";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/Card";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { Button } from "@/components/ui/Button";

export function ProfileForm() {
    const { user, role } = useAuth();

    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [saved, setSaved] = React.useState(false);

    const [displayName, setDisplayName] = React.useState("");
    const [bio, setBio] = React.useState("");
    const [avatarUrl, setAvatarUrl] = React.useState("");

    React.useEffect(() => {
        if (!user?.id) return;
        getUserById(user.id)
            .then((data) => {
                setDisplayName(data.display_name || "");
                setBio(data.bio || "");
                setAvatarUrl(data.avatar_url || "");
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user?.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setSaving(true);
        setError(null);
        setSaved(false);
        const result = await updateUserProfile(user.id, {
            display_name: displayName,
            bio,
            avatar_url: avatarUrl || null,
        });
        setSaving(false);
        if (!result.success) {
            setError(result.error || "Failed to save profile.");
            return;
        }
        setSaved(true);
    };

    if (loading) {
        return <div className="p-6 text-on-surface-variant">Loading profile...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Update how you appear across Setuu.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSave}>
                    <CardContent className="space-y-5">
                        <div className="flex items-center gap-4">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt={displayName || "Avatar"}
                                    className="w-16 h-16 rounded-full object-cover border border-outline-variant"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-lg">
                                    {(displayName || user?.email || "?").charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className="flex-1">
                                <FormField label="Avatar URL" htmlFor="avatarUrl">
                                    <TextInput
                                        id="avatarUrl"
                                        value={avatarUrl}
                                        onChange={(e) => setAvatarUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                </FormField>
                            </div>
                        </div>

                        <FormField label="Display Name" htmlFor="displayName">
                            <TextInput
                                id="displayName"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                required
                            />
                        </FormField>

                        <FormField label="Bio" htmlFor="bio">
                            <textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="flex w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors font-inter"
                            />
                        </FormField>

                        <FormField label="Email" htmlFor="email">
                            <TextInput id="email" defaultValue={user?.email || ""} disabled />
                        </FormField>

                        <FormField label="Role" htmlFor="role">
                            <TextInput id="role" defaultValue={role || ""} disabled className="capitalize" />
                        </FormField>

                        {error && <p className="text-sm text-error">{error}</p>}
                        {saved && <p className="text-sm text-semantic-emerald">Profile saved.</p>}
                    </CardContent>
                    <CardFooter className="justify-end gap-3">
                        <Button type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}