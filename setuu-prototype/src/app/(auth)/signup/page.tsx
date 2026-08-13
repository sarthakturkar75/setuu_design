'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })
    
    if (error) {
      setError(error.message)
      setIsLoading(false)
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-surface-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest dark:bg-surface-container-lowest-dark border border-outline-variant dark:border-outline-variant-dark rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <h1 className="font-merriweather text-3xl font-bold text-on-surface dark:text-on-surface-dark mb-2">Join Setuu</h1>
          <p className="font-inter text-on-surface-variant dark:text-on-surface-variant-dark">Create your account</p>
        </div>
        
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-md mb-6 font-inter text-sm border border-error-container/50">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block font-jetbrains-mono text-xs font-semibold text-on-surface-variant dark:text-on-surface-variant-dark uppercase tracking-wider mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-surface-container-low-dark border border-outline-variant dark:border-outline-variant-dark rounded-md px-3 py-2 text-on-surface dark:text-on-surface-dark font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block font-jetbrains-mono text-xs font-semibold text-on-surface-variant dark:text-on-surface-variant-dark uppercase tracking-wider mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-surface-container-low-dark border border-outline-variant dark:border-outline-variant-dark rounded-md px-3 py-2 text-on-surface dark:text-on-surface-dark font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
            />
          </div>
          <div>
            <label className="block font-jetbrains-mono text-xs font-semibold text-on-surface-variant dark:text-on-surface-variant-dark uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low dark:bg-surface-container-low-dark border border-outline-variant dark:border-outline-variant-dark rounded-md px-3 py-2 text-on-surface dark:text-on-surface-dark font-inter focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary dark:bg-primary-dark text-on-primary dark:text-on-primary-dark font-inter font-semibold py-2.5 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="font-inter text-sm text-on-surface-variant dark:text-on-surface-variant-dark">
            Already have an account? <a href="/login" className="text-secondary dark:text-secondary-dark font-semibold hover:underline">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  )
}