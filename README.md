# AI Chat Application — Final Project Proposal

## 📊 Week 8 Progress Update

### ✅ Completed

- Angular frontend UI (auth pages, chat layout, history sidebar, message input, feedback buttons)
- Node.js + Express server setup and running
- MongoDB connection with Mongoose
- All data models created (User, Chat, Message)
- All API routes and controllers implemented:
  - `POST /api/auth/signup` — register a new user
  - `POST /api/auth/signin` — authenticate user and return JWT
  - `GET /api/chats` — get all chats for logged-in user
  - `DELETE /api/chats/:id` — delete a chat
  - `POST /api/chats/messages` — create chat + send first message
  - `GET /api/chats/:chatId/messages` — get all messages in a chat
  - `POST /api/chats/:chatId/messages` — send message to existing chat
  - `POST /api/messages/:messageId/feedback` — submit feedback on a message
- Groq AI SDK integrated (LLaMA 3.3 70B model) for AI responses
- JWT authentication middleware protecting all routes
- All routes tested and verified in Postman

### 🔄 Still In Progress

- Connect Angular frontend to backend APIs
- HTTP interceptor to attach JWT token to every request
- Deploy to Railway

---

## 1. Project Context / Subject Matter

This project is an **AI-powered chat application** — similar in concept to ChatGPT or Claude — where authenticated users can ask questions, receive AI-generated responses, and provide feedback on those responses. The subject matter sits at the intersection of **conversational AI interfaces**, **user authentication**, and **feedback-driven UX**.

---

## 2. Project Goal

The goal of this project is to learn how to build a full-stack application where real AI-generated responses are integrated end-to-end — from a user typing a message in the browser, to a backend calling an AI SDK, to the response being stored and displayed back to the user. The focus is on understanding how all the pieces (authentication, database, API design, and AI SDK) connect together in a real working app.

---

## 3. Technical Components

### Frontend — Angular + TypeScript + Tailwind CSS

| Component                | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| **Auth Pages**           | Sign Up and Sign In pages with form validation                       |
| **Chat Layout**          | Two-panel layout: left sidebar (history) + right chat area           |
| **Chat History Sidebar** | Lists all past conversations; hover reveals a delete button per row  |
| **Chat Window**          | Displays the message thread for the active conversation              |
| **Message Input**        | Text input to send a new question/message                            |
| **AI Response Display**  | Shows the latest AI response with 👍 / 👎 feedback buttons           |
| **Route Guard**          | Protects the chat route — redirects unauthenticated users to Sign In |

**Angular Routes:**

| Route       | Component           | Auth Required    |
| ----------- | ------------------- | ---------------- |
| `/signup`   | SignUpComponent     | No               |
| `/signin`   | SignInComponent     | No               |
| `/chat`     | ChatComponent       | Yes (Auth Guard) |
| `/chat/:id` | ChatDetailComponent | Yes (Auth Guard) |

---

### Backend — Node.js + Express.js + MongoDB

**API Routes:**

| Method   | Endpoint                            | Description                                                                  | Auth Required |
| -------- | ----------------------------------- | ---------------------------------------------------------------------------- | ------------- |
| `POST`   | `/api/auth/signup`                  | Register a new user                                                          | No            |
| `POST`   | `/api/auth/signin`                  | Authenticate user, return JWT                                                | No            |
| `GET`    | `/api/chats`                        | Get all chat sessions for the logged-in user                                 | Yes           |
| `DELETE` | `/api/chats/:id`                    | Delete a chat session by ID                                                  | Yes           |
| `POST`   | `/api/chats/messages`               | Send first message — auto-creates the chat and uses message content as title | Yes           |
| `GET`    | `/api/chats/:chatId/messages`       | Get all messages in an existing chat                                         | Yes           |
| `POST`   | `/api/chats/:chatId/messages`       | Send a message to an existing chat and receive AI response                   | Yes           |
| `POST`   | `/api/messages/:messageId/feedback` | Submit thumbs up/down feedback on a message                                  | Yes           |

**Data Models (MongoDB):**

```
User
├── _id
├── name
├── email (unique)
├── passwordHash
└── createdAt

Chat
├── _id
├── userId (ref: User)
├── title
└── createdAt

Message
├── _id
├── chatId (ref: Chat)
├── role ("user" | "assistant")
├── content
├── feedback (null | "positive" | "negative")
└── createdAt
```

**Authentication:**

- Passwords hashed with **bcrypt**
- Auth token issued as a **JWT** on sign-in
- All protected routes validated via an Express **JWT middleware** (`Authorization: Bearer <token>`)

**External Data Sources:**

- An **AI SDK** (Groq SDK with LLaMA 3.3 70B model) is installed and used server-side in Node.js. When a user sends a message, the backend calls the SDK, retrieves the AI-generated response, stores both the user message and the AI response in MongoDB, and returns the result to the frontend.

---

## 4. How Project Requirements Will Be Met

| Requirement                        | How It's Met                                                                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend framework**             | Angular with TypeScript and Tailwind CSS                                                                                                         |
| **Backend API**                    | RESTful API built with Node.js and Express.js                                                                                                    |
| **Database**                       | MongoDB with Mongoose ODM for all data persistence                                                                                               |
| **User authentication**            | JWT-based auth with sign-up and sign-in endpoints; protected routes on both frontend (route guard) and backend (middleware)                      |
| **CRUD operations**                | Create/Read chats and messages; Delete chat sessions; Update message feedback                                                                    |
| **External API / SDK integration** | Groq SDK is used server-side in Node.js to generate responses; the SDK is called within the message route and the result is persisted to MongoDB |
| **Value generated**                | Users get a persistent, authenticated AI chat experience with per-message feedback                                                               |

---

## 5. Week-by-Week Timeline

| Week             | Dates           | Goals                                                                                                                                                                                              |
| ---------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Week 1**       | May 14 – May 20 | ✅ Submit proposal. ✅ Angular frontend UI completed (auth pages, chat layout, history sidebar, message input, feedback buttons).                                                                  |
| **Week 2**       | May 21 – May 27 | ✅ Build backend: set up Node.js/Express boilerplate, connect MongoDB, implement auth routes with bcrypt and JWT. Build all chat and message routes. Apply JWT middleware to all protected routes. |
| **Week 3**       | May 28 – June 4 | Integrate Angular frontend to all backend APIs. Test full end-to-end user flow. Polish, fix bugs, and finalize documentation. Deploy to Railway.                                                   |
| **Presentation** | June 5          | Final project presentation.                                                                                                                                                                        |

---

## Tech Stack Summary

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Frontend        | Angular, TypeScript, Tailwind CSS                    |
| Backend         | Node.js, Express.js                                  |
| Database        | MongoDB (Mongoose)                                   |
| Auth            | JWT, bcrypt                                          |
| AI Integration  | Groq SDK (LLaMA 3.3 70B) used server-side in Node.js |
| Version Control | GitHub                                               |
