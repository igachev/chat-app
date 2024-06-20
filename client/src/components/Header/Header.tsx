"use client"
import { UserData } from '@/app/chat/page'
import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header = () => {

  const { isSignedIn } = useAuth();
  const [userData,setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    if (isSignedIn) {
     setTimeout(() => {
      const userDataString = localStorage?.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserData(userData);
      }
     }, 400);
    } else {
      localStorage.removeItem('userData');
      setUserData(null);
    }
  }, [isSignedIn]);
    
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

          {userData && (
            <h3>Welcome, {userData?.username}!</h3>
            )}
          
        </header>
    </>
  )
}

export default Header