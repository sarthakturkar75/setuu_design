"use client";

import * as React from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-full transition-colors flex items-center justify-center"
      title="Sign Out"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
