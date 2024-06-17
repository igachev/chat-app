"use client";
import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { useRouter } from "next/navigation";


const LoginPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const router = useRouter()

   // Handle the submission of the sign-in form
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        
        await setActive({ session: signInAttempt.createdSessionId });
       
        router.push('/chat');

        const response = await fetch("/api/login",{
          method: "POST",
          body: JSON.stringify({email,password})
        })
        const result = await response.json()
        localStorage.setItem("userData",JSON.stringify(result))
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
     
      console.error(JSON.stringify(err, null, 2));
    }
  };
  

  return (
    <div className="w-1/3 bg-red-300 p-3">
        <h1 className="text-center mb-2">Login Page</h1>

        <form method="post" onSubmit={handleSubmit}>

    <div className="flex items-center gap-2 mb-2">
    <Label className="w-1/6" htmlFor="email">Email:</Label>
    <Input type="text" className="w-1/3" name="email" onChange={(e) => setEmail(e.target.value)} />
    </div>

    <div className="flex items-center gap-2 mb-2">
    <Label className="w-1/6" htmlFor="password">Password:</Label>
    <Input type="password" className="w-1/3" name="password" onChange={(e) => setPassword(e.target.value)} />
    </div>

    <div className="text-center">
    <Button type="submit" variant="default">Button</Button>
    </div>

        </form>
    </div>
  )
}

export default LoginPage

function err(reason: any): PromiseLike<never> {
  throw new Error("Function not implemented.");
}
