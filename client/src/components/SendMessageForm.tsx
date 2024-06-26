import React, { ChangeEvent } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';

interface sendMessageForm {
    sendMessage: (e: React.FormEvent) => Promise<void>;
    newMessage: string;
    typingHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SendMessageForm = ({
    sendMessage,
    newMessage,
    typingHandler
}: sendMessageForm) => {
  return (
    <form method="post" onSubmit={sendMessage}>
                <Input type="text"
                 className="w-4/6 focus-visible:ring-1"
                 value={newMessage} 
                 onChange={typingHandler} 
                 placeholder="Enter a message..."
                 />
                <Button type="submit" variant="default" className="m-3">Send</Button>
    </form>
  )
}

export default SendMessageForm