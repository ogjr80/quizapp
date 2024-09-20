import { IUserSession } from '@/lib/types/UserSession'
import Link from 'next/link'
import React from 'react'

export const RegisterAction: React.FC<{url:string, mode?: 'session'|'register', session?: IUserSession}> = ({url, mode="register", session}) => {
  console.log(session)
  return (
    <div>
        <Link href={mode === 'register' ? url : 'public' + '?mode=test'} className="mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded">
          {mode === 'register' ? 'Register Now' : 'Test run'}
        </Link>
    </div>
  )
}
