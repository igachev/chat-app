'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Errors {
  gmail: string;
  password: string;
  username: string;
}

interface VerifyError {
  verification: string;
}

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('')
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState('');
  const router = useRouter();
  const err = {gmail: "",password: "",username: ""}
  const [errors,setErrors] = useState<Errors>(err)
  const verifyErr = {verification: ""}
  const [verificationError,setVerificationError] = useState<VerifyError>(verifyErr)

  // Handle submission of the sign-up form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const errorObj = {...err}
    let errorOccured = false;

    if(emailAddress === '') {
      errorObj.gmail = 'Gmail is required'
      errorOccured = true;
    }

    if(password === '') {
      errorObj.password = "Password is required"
      errorOccured = true;
    }

    if(username === '') {
      errorObj.username = "Username is required"
      errorOccured = true;
    }

    setErrors(errorObj)

    if(errorOccured) {
      return;
    }

    // Start the sign-up process using the email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send the user an email with the verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code',
      });

      // Set 'verifying' true to display second form
      // and capture the OTP code
      setVerifying(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle the submission of the verification form
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded) return;

    const errObj = {...verifyErr}
    let errorOccured = false;

    if(code === '') {
      errObj.verification = "verification code is required"
      errorOccured = true;
    }

    setVerificationError(errObj)

    if(errorOccured) {
      return;
    }

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        const response = await fetch("/api/register",{
            method: 'POST',
            body: JSON.stringify({email:emailAddress,password:password,username:username})
        })
        const result = await response.json()
        localStorage.setItem("userData",JSON.stringify(result))
        router.push('/chat');
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
     
      console.error('Error:', JSON.stringify(err, null, 2));
    }
  };

  // Display the verification form to capture the OTP code
  if (verifying) {
    return (
      <div className='min-h-[900px] bg-slate-500 text-white'>
        <h1 className='text-center text-4xl py-2 font-light'>Verify your email</h1>
        <form onSubmit={handleVerify} className='flex flex-col items-center gap-2'>
          <label id="code">Enter your verification code</label>
          <Input
            value={code}
            id="code"
            name="code"
            onChange={(e) => setCode(e.target.value)}
            className='text-black w-2/6'
          />
          {verificationError.verification && (<p className='text-red-300 mt-2 text-center'>{verificationError.verification}</p>)}
          <Button type="submit" variant="default">Verify</Button>
        </form>
      </div>
    );
  }

  // Display the initial sign-up form to capture the email and password
  return (
    <>
      <div className='min-h-[900px] bg-slate-500 text-white'>
      <h1 className='text-center text-4xl py-2 font-light'>Sign up</h1>
      <form onSubmit={handleSubmit} className='w-1/2 mx-auto p-2 bg-slate-400 flex flex-col items-center justify-center border rounded-md border-slate-600 shadow-2xl'>
        <div className='my-2 p-1'>
          <label htmlFor="email">Enter gmail address</label>
          <Input
            id="email"
            className='mt-2 text-black'
            type="email"
            name="email"
            value={emailAddress}
            onChange={(e) => setEmailAddress(e.target.value)}
          />
          {errors.gmail && (<p className='text-red-700 mt-2 text-center'>{errors.gmail}</p>)}
        </div>
        <div className='my-2 p-1'>
          <label htmlFor="password">Enter password</label>
          <Input
            id="password"
            className='mt-2 text-black'
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (<p className='text-red-700 mt-2 text-center'>{errors.password}</p>)}
        </div>
        <div className='my-2 p-1'>
          <label htmlFor="username">Enter username</label>
          <Input
            id="username"
            className='mt-2 text-black'
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (<p className='text-red-700 mt-2 text-center'>{errors.username}</p>)}
        </div>
        <div>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
      </div>
    </>
  );
}