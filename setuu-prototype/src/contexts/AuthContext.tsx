'use client'

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
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
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [organizationId, setOrganizationId] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [showInactivityWarning, setShowInactivityWarning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)
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
        setRole(actor?.role || (session.user.email?.includes('superadmin') ? 'superadmin' : null))
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
        setRole(actor?.role || (session.user.email?.includes('superadmin') ? 'superadmin' : null))
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

  
  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (warningRef.current) clearTimeout(warningRef.current)
    
    setShowInactivityWarning(false)

    if (user) {
      // Warning at 25 minutes
      warningRef.current = setTimeout(() => {
        setShowInactivityWarning(true)
      }, 25 * 60 * 1000)

      // Logout at 30 minutes
      timeoutRef.current = setTimeout(() => {
        signOut()
      }, 30 * 60 * 1000)
    }
  }, [user])

  useEffect(() => {
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    const handleActivity = () => resetTimer()
    events.forEach(e => window.addEventListener(e, handleActivity))
    resetTimer()

    return () => {
      events.forEach(e => window.removeEventListener(e, handleActivity))
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (warningRef.current) clearTimeout(warningRef.current)
    }
  }, [resetTimer])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setRole(null)
    setOrganizationId(null)
    setDisplayName(null)
    setAvatarUrl(null)
    router.push('/auth');
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, role, organizationId, displayName, avatarUrl, isLoading, signOut }}>

      {children}
      {showInactivityWarning && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-surface p-6 rounded-lg shadow-lg border border-border max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-bold text-on-surface">Are you still there?</h2>
            <p className="text-on-surface-variant">Your session will expire soon due to inactivity.</p>
            <button onClick={resetTimer} className="w-full py-2 bg-primary text-on-primary rounded-md">
              Keep me logged in
            </button>
          </div>
        </div>
      )}
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
