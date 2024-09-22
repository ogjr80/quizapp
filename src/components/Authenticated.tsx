'use client'
import { useSession, signOut, signIn } from "next-auth/react"
import React from 'react'

export const Authenticated = () => {
    const { data: session, status } = useSession()
    return (
        <div>
            {
                status === 'authenticated' ? (
                    <div>
                        <p>Welcome, {session?.user?.name}</p>
                        <button onClick={() => signOut()}>Sign out</button>
                    </div>
                ) : (
                    <div>
                        <p>Please sign in</p>
                        <button onClick={() => signIn()}>Sign in</button>
                    </div>
                )
            }
        </div>
    )
}
