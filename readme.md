# 🎥 Simple 1-to-1 Video Chat App

A minimal **video calling app** built with **HTML, JavaScript, PeerJS, Socket.IO, and Node.js**.  
This project demonstrates how to set up a simple peer-to-peer video call using a signaling server.

---

## ✨ Features

- 🔗 Real-time **1-to-1 video calls**
- ⚡ Peer-to-peer connection via **PeerJS**
- 📋 User list with `joinedAt` timestamp
- 🔄 Auto-updates when users join or leave
- 🖥️ Simple UI with **Call button**

---

## 🛠 Tech Stack

- **Frontend:** HTML, JavaScript, PeerJS
- **Backend:** Node.js, Socket.IO

---

## ⚡ How It Works

1. **Connect to server**

   - When a user opens the app, their **socket** connects to the server (`port 4000`).
   - A **PeerJS instance** is created using the user’s `socket.id`.
   - The server saves the user in a global list with `socket.id` and `joinedAt`.

2. **Users list**

   - On first load, the client listens to the event **`users`** to receive the **current list of online users**.

3. **User updates**

   - When someone joins or disconnects, the event **`all-user`** is broadcasted with the updated user list.
   - The frontend updates the UI accordingly.

4. **UI rendering**

   - Each online user (except yourself) is displayed with their `joinedAt` time and a **Call button**.

5. **Making a call**
   - When you press the **Call button**, a PeerJS **`call`** event runs and connects to the selected user by their ID.
   - A **video call** starts between the two peers.

---

## ▶️ Getting Started

Install dependencies

```bash
npm install
```

Start the server

```bash
node server.js
```

open the front with liveserver
