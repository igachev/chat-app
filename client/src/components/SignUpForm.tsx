import { useSignUp } from '@clerk/nextjs';
import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';

interface signUpForm {
    emailAddress: string;
    setEmailAddress: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    username: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    setFile: React.Dispatch<React.SetStateAction<File | undefined>>;
    setVerifying: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Errors {
    gmail: string;
    password: string;
    username: string;
  }

const SignUpForm = ({
    emailAddress,
    setEmailAddress,
    password,
    setPassword,
    username,
    setUsername,
    setFile,
    setVerifying
}: signUpForm) => {

    const err = {gmail: "",password: "",username: ""}
    const [errors,setErrors] = useState<Errors>(err)
    const { isLoaded, signUp, setActive } = useSignUp();

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
        <div className='my-2 p-1'>
        <label htmlFor="file">Profile Picture</label>
        <Input 
        id='file'
        className='mt-2 text-black'
        type='file'
        name='file'
        onChange={(e) => setFile(e.target.files?.[0])}
        />
        </div>
        <div>
          <Button type="submit" variant="default">Next</Button>
        </div>
      </form>
      </div>
    </>
  );
}

export default SignUpForm