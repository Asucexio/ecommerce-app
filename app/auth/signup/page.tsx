import React from 'react'
import { redirect } from 'next/navigation'
import { requireNoAuth } from '@/lib/auth/guards'
import { resolveRequestContext } from '@/lib/auth/request-context'
import { SignupForm } from './SignupForm'
import { createSupabaseServerClient } from '@/lib/supabase/server'

export default async function SignupPage() {
    const context = await resolveRequestContext(request)
    const authError = requireNoAuth(context)

    if (authError) return authError

    const supabase = createSupabaseServerClient()

    return (
        <div className="min-h-screen flex items-center justify-center">
            <SignupForm supabase={supabase} />
        </div>
    )
}
