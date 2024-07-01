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


## Routes:
- `/` : <span>Home Page</span>
- `/register` : <span>Register Page</span>
- `/login` : <span>Login Page</span>
- `/chat` : <span>Chat Page</span>


## Images and how it works:
<div align="center">
   <p>Home Page.Accessible by guest user and logged in user</p>
   
   ![1 home](https://github.com/igachev/chat-app/assets/102420254/7a53694a-42c5-4d17-bb9f-7850a13cebfc)

</div>


<div align="center">
   <p>Register Page.Accessible by guest user.If field values are empty validation errors will appear.</p>

![2 register](https://github.com/igachev/chat-app/assets/102420254/58885540-7e5a-4cc1-9691-05237a28d85e)

</div>

<div align="center">
   <p>after pressing the Next button, a confirmation code will be sent to the specified email</p>

![4 verifyRegister](https://github.com/igachev/chat-app/assets/102420254/ec420f52-a0e8-409a-9bf7-8b5ff72522c0)

</div>

<div align="center">
   <p>Login Page.Accessible by guest user.If field values are empty validation errors will appear.</p>

![3 login](https://github.com/igachev/chat-app/assets/102420254/f7a5f3ac-d424-4b84-a00c-429722352c41)

</div>

<div align="center">
   <p>Chat Page.Accessible by logged user.The list of existing users is placed on the right.</p>

![5 chatPage](https://github.com/igachev/chat-app/assets/102420254/6deb9f03-28ac-4f90-9f0e-281b34347723)

</div>

<div align="center">
   <p>When the user clicks on user profile a chat will open.Chat is a scrollable container that displays the user's name and the user's message.</p>

   ![6 chat](https://github.com/igachev/chat-app/assets/102420254/664120d3-bc25-423a-ac4e-b4ab796ea219)

</div>

<div align="center">
   <p>When the user types, the other user will get a popup message that says "username is typing...". The pop-up message will disappear after 3 seconds.The user can send a message when press "enter" key or click "Send" button.</p>

![7 typing](https://github.com/igachev/chat-app/assets/102420254/bfae97b0-da21-4a61-bc80-0c2468bf1284)

</div>
