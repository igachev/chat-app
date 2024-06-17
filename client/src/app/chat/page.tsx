"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input";

import io from 'socket.io-client';
import { ChangeEvent, useEffect, useState } from "react";

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

interface Messages {
  _id: string;
  sender: {_id: string; username: string};
  text: string;
}

const socket = io();

const ChatPage = () => {

const [users,setUsers] = useState<User[]>([])
const [userData,setUserData] = useState<UserData | null>(null)
const [messages,setMessages] = useState<Messages[]>([])
const [isChatOpen,setIsChatOpen] = useState<boolean>(false)
const [newMessage,setNewMessage] = useState<string>("")
const [receiver,setReceiver] = useState<string>("")
const [isConnected, setIsConnected] = useState(false);
const [transport, setTransport] = useState("N/A");
const [typing,setTyping] = useState<boolean>(false)
const [selectedChatId,setSelectedChatId] = useState<string>("")

useEffect(() => {
  const userDataString = localStorage?.getItem("userData");
  if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUserData(userData);
  }
},[])

useEffect(() => {
  if (socket.connected) {
    onConnect();
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("typing", () => setTyping(true));
    socket.on("stop typing", () => setTyping(false));
  }

  function onConnect() {
    setIsConnected(true);
    setTransport(socket.io.engine.transport.name);

    socket.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }

  function onDisconnect() {
    setIsConnected(false);
    setTransport("N/A");
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
}, []);

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


async function openChat(to: string) {
  try {
    const chat = await fetch(`/api/users?from=${userData?.userId}&to=${to}`,{
      method: "POST"
    })
    const chatResult = await chat.json()
    socket.emit("join chat", chatResult._id);
    setIsChatOpen(true)
    setSelectedChatId(chatResult._id)
    const getMessages = await fetch(`/api/messages?from=${userData?.userId}&to=${to}`)
    const receivedMessages = await getMessages.json()
    setMessages(receivedMessages)
    setReceiver(to)
  } catch (err) {
    console.log(err)
  }
}

async function sendMessage(e:React.FormEvent) {
  try {
    e.preventDefault();
    const messageSent = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({from: userData?.userId, to:receiver, text: newMessage})
    })
    const messageResult = await messageSent.json()
    if (socket) {
      socket.emit('sendMessage', {
        from: userData?.userId,
        to: receiver,
        text: newMessage,
        sender: {
          username: userData?.username
        },
        _id: messageResult._id
      });
    }
  //  const getMessages = await fetch(`/api/messages?from=${userData?.userId}&to=${receiver}`)
  //  const receivedMessages = await getMessages.json()
  //  setMessages(receivedMessages)
    setNewMessage("")
  } catch (err) {
    console.log(err)
  }
}

const typingHandler = (e: ChangeEvent<HTMLInputElement>) => {
  setNewMessage(e.target.value);


  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChatId);
  }
  let lastTypingTime = new Date().getTime();
  var timerLength = 3000;
  setTimeout(() => {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", selectedChatId);
      setTyping(false);
    }
  }, timerLength);
};

  return (
    <div className="min-h-[900px] bg-slate-600 relative">
        
        <h1>Chat Page</h1>
        <div className=" flex flex-wrap justify-center gap-2 mx-auto p-2 bg-purple-500 w-3/5 min-w-[230px] items-center">
        
        {users.length > 0 && users.map((user) => {
           if(user._id !== userData?.userId) {
            return (
            <Card key={user._id} className="min-w-[200px] cursor-pointer" onClick={() => openChat(user._id)}>
              <CardHeader>
                <CardTitle>{user.username}</CardTitle>
                <CardDescription className=""><img src={user.profileImage} width={50} height={50} alt="profile-image" /></CardDescription>
              </CardHeader>
            </Card>
            )
           }
           else {
            return null;
           }
        })}

        </div>

        {isChatOpen ? (
          <div className="bg-green-500 absolute bottom-0 w-3/6">

            <div className="bg-blue-400 w-4/6 p-2">
              {messages.length > 0 && messages.map((message) => (
                <Card key={message._id} className="w-5/6">
                  <CardHeader>
                    <CardTitle>{message.sender.username}</CardTitle>
                    <CardDescription>{message.text}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="w-4/6 m-2">
            {typing && <div>Typing...</div>}
              <form method="post" onSubmit={sendMessage}>
                <Input type="text"
                 className="w-4/6 focus-visible:ring-1"
                 value={newMessage} 
                 onChange={typingHandler} />
                <Button type="submit" variant="default" className="m-3">Send</Button>
              </form>
            </div>

          </div>
        ) : null}

    </div>
  )
}

export default ChatPage