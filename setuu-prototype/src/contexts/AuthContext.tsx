'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

type AuthContextType = {
  user: User | null
  role: string | null
  organizationId: string | null
  displayName: string | null
  avatarUrl: string | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data: actor } = await supabase
          .from('user_actor')
          .select('role, organization_id, display_name, avatar_url')
          .eq('id', session.user.id)
          .single()
        setRole(actor?.role || null)
        setOrganizationId(actor?.organization_id || null)
        setDisplayName(actor?.display_name || null)
        setAvatarUrl(actor?.avatar_url || null)
      }
      setIsLoading(false)
    }

    fetchSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const { data: actor } = await supabase
          .from('user_actor')
          .select('role, organization_id, display_name, avatar_url')
          .eq('id', session.user.id)
          .single()
        setRole(actor?.role || null)
        setOrganizationId(actor?.organization_id || null)
        setDisplayName(actor?.display_name || null)
        setAvatarUrl(actor?.avatar_url || null)
      } else {
        setRole(null)
        setOrganizationId(null)
        setDisplayName(null)
        setAvatarUrl(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setOrganizationId(null)
    setDisplayName(null)
    setAvatarUrl(null)
  }

  return (
    <AuthContext.Provider value={{ user, role, organizationId, displayName, avatarUrl, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useUser() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useUser must be used within an AuthProvider')
  }
  return context.user
}

export function useRole() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useRole must be used within an AuthProvider')
  }
  return context.role
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
