"use client";

import io from 'socket.io-client';
import { ChangeEvent, useEffect, useState } from "react";
import UserList from "@/components/UserList";
import UserMessages from "@/components/UserMessages";
import SendMessageForm from "@/components/SendMessageForm";

export interface User {
    _id: string;
    email: string;
    username: string;
    profileImage: string;
    __v: number;
}

export interface UserData {
  userId: string;
  username: string;
}

export interface Messages {
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
const [currentUserIsTyping,setCurrentUserIsTyping] = useState<boolean>(false)
const [selectedChatId,setSelectedChatId] = useState<string>("")
const [toUser,setToUser] = useState<string>("")


useEffect(() => {
  const userDataString = localStorage?.getItem("userData");
  if (userDataString) {
      const userData = JSON.parse(userDataString);
      socket.emit("setup",userData)
      setUserData(userData);
  }
},[])

useEffect(() => {
  if (socket.connected) {
    onConnect();
  
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
  
  socket.on("connected",() => console.log("connected"))
  socket.on('receiveMessage', (message) => setMessages((prevMessages) =>  [...prevMessages,message])); 
  socket.on("typing", () => setCurrentUserIsTyping(true));
  socket.on("stop typing", () => setCurrentUserIsTyping(false));

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
  };
},[]);


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
    let sendingToUser = users.find((user) => user._id === to)
    if(sendingToUser != undefined) {
      setToUser(sendingToUser.username)
    }
  } catch (err) {
    console.log(err)
  }
}

async function sendMessage(e:React.FormEvent) {
  try {
    e.preventDefault();
    const messageSent = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({from: userData?.userId, to:receiver, text: newMessage})
    })
    const messageResult = await messageSent.json()
    if (socket) {
      socket.emit('sendMessage',messageResult);
      socket.emit("stop typing",messageResult.chat._id)
    }
  
    setMessages((messages) => [...messages,messageResult])
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
    <div className="min-h-[900px] bg-slate-500 relative">
        
        <h1 className="text-2xl text-white text-center font-light uppercase p-2">click on a user from the list of users and start a chat</h1>
        <div className="absolute right-1 flex flex-wrap flex-col justify-center gap-2 p-2 bg-purple-50  min-w-[230px] h-3/6 items-center overflow-y-scroll rounded-md shadow-2xl">
        <UserList users={users} openChat={openChat} userData={userData} />
        </div>

        {isChatOpen ? (
          

<div className="bg-orange-800 absolute bottom-2 left-2 w-3/6 min-w-[400px] h-2/6 overflow-y-scroll">
            
            <UserMessages messages={messages} userData={userData} setIsChatOpen={setIsChatOpen} />
            
            <div className="w-4/6 m-2">
            {currentUserIsTyping && toUser && <div>{toUser} is typing...</div>}
            <SendMessageForm sendMessage={sendMessage} newMessage={newMessage} typingHandler={typingHandler} />
            </div>

</div>
 
        ) : null}

    </div>
  )
}

export default ChatPage