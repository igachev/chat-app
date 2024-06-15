"use client"
import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect } from 'react'

const Header = () => {

  const { isSignedIn,userId } = useAuth();

  useEffect(() => {
    if(!isSignedIn) {
      localStorage.removeItem('userData')
    }
  },[isSignedIn])
    
  return (
    <>
    <header>
            
            {!isSignedIn && (
              <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              </>
            )}
          
            {isSignedIn && (
              <UserButton afterSignOutUrl="/" />
            )}
          
        </header>
    </>
  )
}

export default Header