"use client";
import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useState } from "react";
import { useRouter } from "next/navigation";
import SignInForm from '@/components/SignInForm';

interface ValidationError {
  email: string;
  password: string;
}

const LoginPage = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const error: ValidationError = {email: '', password: ''}
  const [errors,setErrors] = useState<ValidationError>(error)
  const router = useRouter()

   // Handle the submission of the sign-in form
   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    const validationError: ValidationError = {...error};
    let errorOccured: boolean = false;

    if(email === '') {
      validationError.email = 'Email is required'
      errorOccured = true;
    }

    if(password === '') {
      validationError.password = 'Password is required'
      errorOccured = true;
    }

    setErrors(validationError)

    if(errorOccured) {
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
       
        const response = await fetch("/api/login",{
          method: "POST",
          body: JSON.stringify({email,password})
        })
        
        const result = await response.json()
        localStorage.setItem("userData",JSON.stringify(result))
        // Dispatch custom event
        window.dispatchEvent(new Event('userDataChanged'));
        router.push('/chat');
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
    <div className="min-h-[900px] bg-slate-500 p-5">
        <h1 className="text-center mb-2 text-white text-5xl font-light">Login Page</h1>

        <SignInForm handleSubmit={handleSubmit} setEmail={setEmail} setPassword={setPassword} errors={errors} />
        
    </div>
  )
}

export default LoginPage

function err(reason: any): PromiseLike<never> {
  throw new Error("Function not implemented.");
}
