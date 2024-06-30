import { User, UserData } from '@/app/chat/page'
import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface userList {
    users: User[];
    openChat: (to: string) => Promise<void>;
    userData: UserData | null;
}

const UserList = ({
users,
openChat,
userData
}: userList) => {

  return (
  <>
    {users.length > 0 && users.map((user) => {
        if(user._id !== userData?.userId) {
         return (
         <Card key={user._id} className="min-w-[200px] cursor-pointer" onClick={() => openChat(user._id)}>
           <CardHeader>
             <CardTitle>{user.username}</CardTitle>
             <CardDescription className="">
               <img src={`/uploads/${user.profileImage}`} width={50} height={50} alt="profile-image" />
               </CardDescription>
           </CardHeader>
         </Card>
         )
        }
        else {
         return null;
        }
     })}
  </>
  )
  
}

export default UserList