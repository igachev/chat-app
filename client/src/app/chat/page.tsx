"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


import { useEffect, useState } from "react";

interface User {
    _id: string;
    email: string;
    username: string;
    profileImage: string;
    __v: number;
}

interface UserData {
  userId: string;
  username: string;
}

const ChatPage = () => {

const [users,setUsers] = useState<User[]>([])
const [userData,setUserData] = useState<UserData | null>(() => {
  const userDataString = localStorage.getItem("userData")
  let userData;
  if(userDataString) {
    userData = JSON.parse(userDataString)
    return userData
  }
  return null
})

useEffect(() => {

    async function getUsers() {
        try {
            const response = await fetch("/api/users",{
                method: "GET"
            })
            const result = await response.json()
            console.log(result)
            
            setUsers(result)
        } catch (err) {
            console.log(err)
        }
    }

    getUsers()
},[])

  return (
    <div className="min-h-[900px] bg-slate-600">
        <h1>Chat Page</h1>

        <div className="flex flex-wrap justify-center gap-2 mx-auto p-2 bg-purple-500 w-3/5 min-w-[230px] items-center">
        
        {users.length > 0 && users.map((user) => {
           if(user._id !== userData?.userId) {
            return (<Card key={user._id} className="min-w-[200px]">
              <CardHeader>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription className=""><img src={user.profileImage} width={50} height={50} alt="profile-image" /></CardDescription>
              </CardHeader>
            </Card>)
           }
           else {
            return null;
           }
        })}

        </div>

    </div>
  )
}

export default ChatPage