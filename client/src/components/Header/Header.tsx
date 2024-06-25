"use client"
import { UserData } from '@/app/chat/page'
import { UserButton, useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Header = () => {

  let { isSignedIn } = useAuth();
  const [userData,setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const updateUserData = () => {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const data = JSON.parse(userDataString);
        setUserData(data);
      }
    };

    updateUserData(); // Initial check

    // Listen for custom event
    window.addEventListener('userDataChanged', updateUserData);

    return () => {
      window.removeEventListener('userDataChanged', updateUserData);
    };
  }, []);

  useEffect(() => {
    if(!isSignedIn) {
      setUserData(null)
      localStorage.removeItem("userData")
    }
  },[isSignedIn])
  
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