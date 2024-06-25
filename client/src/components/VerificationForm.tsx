import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';


interface VerifyError {
    verification: string;
}

interface verificationForm {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    emailAddress: string;
    password: string;
    username: string;
    file: File | undefined;
}

const VerificationForm = ({
    code,
    setCode,
    emailAddress,
    password,
    username,
    file
}: verificationForm) => {

  const verifyErr = {verification: ""}
  const [verificationError,setVerificationError] = useState<VerifyError>(verifyErr)
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

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
        const data: any = new FormData()
        data.set("email",emailAddress)
        data.set("password",password)
        data.set("username",username)
        data.set("file",file)
        const response = await fetch("/api/register",{
            method: 'POST',
            body: data
        })
        const result = await response.json()
        localStorage.setItem("userData",JSON.stringify(result))
        // Dispatch custom event
        window.dispatchEvent(new Event('userDataChanged'));
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

export default VerificationForm