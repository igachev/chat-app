import React from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface SignInFormProps {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    errors: {email: string; password: string;};
}

const SignInForm = ({
handleSubmit,
setEmail,
setPassword,
errors
}:SignInFormProps) => {
  return (
    <form method="post" onSubmit={handleSubmit} className='flex flex-col justify-center min-h-[500px] border border-black rounded-md shadow-inner bg-slate-400'>

    <div className="flex justify-center items-center gap-2 mb-2 ">
    <Label className="mr-7 text-white font-normal text-1xl" htmlFor="email">Email:</Label>
    <Input type="text" className="w-2/6" name="email" onChange={(e) => setEmail(e.target.value)} />
    {errors.email && <p className='text-red-700 mt-2 text-center'>{errors.email}</p>}
    </div>
    
    <div className="flex justify-center items-center gap-2 mb-2 ">
    <Label className="text-white font-normal text-1xl" htmlFor="password">Password:</Label>
    <Input type="password" className="w-2/6" name="password" onChange={(e) => setPassword(e.target.value)} />
    {errors.password && <p className='text-red-700 mt-2 text-center'>{errors.password}</p>}
    </div>
    

    <div className="flex justify-center mt-2">
    <Button type="submit" variant="default">Button</Button>
    </div>

        </form>
  )
}

export default SignInForm