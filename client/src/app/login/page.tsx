"use client";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"


const LoginPage = () => {
  return (
    <div className="w-1/3 bg-red-300 p-3">
        <h1 className="text-center mb-2">Login Page</h1>
        <form method="post">

    <div className="flex items-center gap-2 mb-2">
    <Label className="w-1/6" htmlFor="email">Email:</Label>
    <Input type="text" className="w-1/3" name="email" />
    </div>

    <div className="flex items-center gap-2 mb-2">
    <Label className="w-1/6" htmlFor="password">Password:</Label>
    <Input type="password" className="w-1/3" name="password" />
    </div>

    <div className="text-center">
    <Button type="submit" variant="default">Button</Button>
    </div>

        </form>
    </div>
  )
}

export default LoginPage