import { Messages, UserData } from '@/app/chat/page'
import React, { Dispatch, SetStateAction } from 'react'
import { Button } from './ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';

interface userMessages {
    messages: Messages[];
    userData: UserData | null;
    setIsChatOpen: Dispatch<SetStateAction<boolean>>;
}

const UserMessages = ({
  messages,
  userData,
  setIsChatOpen
}: userMessages) => {
  return (
    <div className="bg-orange-200 w-full p-2 flex flex-col items-center gap-2">
            
              <div className="w-full flex justify-end">
              <Button className="fixed" onClick={() => setIsChatOpen(false)}>X</Button>
              </div>
              {messages.length > 0 && messages.map((message) => (  
                <Card key={message._id} className="w-5/6 min-w-[300px] shadow-xl" style={ userData?.username === message.sender.username ? {backgroundColor: '#ADD8E6'} : {backgroundColor: "white"} }>
                  <CardHeader className="w-5/6 ">
                    <CardTitle className="text-lg font-normal tracking-wider italic">{userData?.username === message.sender.username ? "You" : message.sender.username}</CardTitle>
                    <hr />
                    <CardDescription className="w-5/6 break-words text-left text-base text-slate-700">{message.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
  )
}

export default UserMessages