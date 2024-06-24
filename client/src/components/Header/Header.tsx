"use client"
import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {

  let { isSignedIn } = useAuth();
  
  return (
    <>
    <header className='flex justify-around items-center p-1 bg-slate-400 text-white'>
            
            {!isSignedIn && (
              <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              </>
            )}
          
            {isSignedIn && (
              <div >
                <UserButton afterSignOutUrl="/" />
              </div>
            )}
          
        </header>
    </>
  )
}

export default Header