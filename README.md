# Chat Application


## Purpose of this application:
<h3>Single chat with text messages.Communication with other users.</h3>


## What I learned and practiced in this project:
- `next.js`
- `next.js client-side and server-side rendering`
- `next.js routing`
- `next.js serverless API to create API endpoints`
- `React Lifting state up`
- `React hooks`
- `Dispatch JavaScript Custom Event and add event listener for it`
- `to use clerk library for authentication`
- `route guards using clerk middleware`
- `shadcn/UI`
- `tailwind CSS`
- `socket io to enable real-time communication`
- `CSS flexbox`
- `mongoDB with mongoose to store the data`


## Requirements:
   - "@clerk/nextjs": "^5.1.5",
   - "@radix-ui/react-label": "^2.0.2",
   - "@radix-ui/react-slot": "^1.0.2",
   - "bcrypt": "^5.1.1",
   - "class-variance-authority": "^0.7.0",
   - "clsx": "^2.1.1",
   - "lucide-react": "^0.394.0",
   - "mongoose": "^8.4.1",
   - "next": "14.2.3",
   - "react": "^18",
   - "react-dom": "^18",
   - "socket.io": "^4.7.5",
   - "socket.io-client": "^4.7.5",
   - "tailwind-merge": "^2.3.0",
   - "tailwindcss-animate": "^1.0.7"


## Installation:
To run the application execute the following steps:
1. clone this repository: `git clone https://github.com/igachev/chat-app.git`
2. Go to clerk,register,go to dashboard,get these variables <br> <strong>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</strong> <br> <strong>CLERK_SECRET_KEY</strong> <br> and place them in `/client/env.local`
3. Go to folder client: `cd client`
4. Install dependencies: `npm install`
5. Start the app: `npm run dev`


## Endpoints:
- `POST /api/register` : <span>creates new user</span>
- `POST /api/login` : <span>sign in existing user</span>
- `GET /api/users` : <span>returns all existing users</span>
- `POST /api/users?from= &to= ` : <span>creates new chat between two users or returns the chat if it already exists</span>
- `GET /api/messages?from= &to= ` : <span>returns all messages exchanged between the two users</span>
- `POST /api/messages` : <span>creates new message in the chat</span>
