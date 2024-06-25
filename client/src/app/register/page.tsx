'use client';

import * as React from 'react';
import { useState } from 'react';
import SignUpForm from '@/components/SignUpForm';
import VerificationForm from '@/components/VerificationForm';

export default function Page() {
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [username, setUsername] = React.useState('')
  const [file,setFile] = useState<File>()
  const [verifying, setVerifying] = React.useState(false);
  const [code, setCode] = React.useState('');
 
  if (verifying) {
     // Display the verification form to capture the OTP code
  return <VerificationForm
  code={code}
  setCode={setCode}
  emailAddress={emailAddress}
  password={password}
  username={username}
  file={file}
  />
  }

  // Display the initial sign-up form to capture the email and password
  return <SignUpForm 
  emailAddress={emailAddress}
  setEmailAddress={setEmailAddress} 
  password={password}
  setPassword={setPassword}
  username={username}
  setUsername={setUsername}
  setFile={setFile}
  setVerifying={setVerifying}
  />
  
}