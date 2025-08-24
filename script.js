let mySocketId = "";
let myStream = null;
let peer = null;

const socket = io("http://localhost:4000");

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to server ,your ID:", socket.id);
  peer = new Peer(socket.id);
  mySocketId = socket.id;
});

const usersContainer = document.querySelector(".users-container");

function createUserElement(item) {
  const element = document.createElement("div");
  const button = document.createElement("button");
  button.textContent = "Call";
  button.style.width = "fit-content";
  button.onclick = () => {
    callUser(item.socketId);
  };
  element.innerHTML = `<div>${new Date(item.joinedAt).toLocaleString()}</div>`;
  usersContainer.appendChild(element);
  usersContainer.appendChild(button);
}

function callUser(peerId) {
  console.log("Call user with Id:", peerId);
  const call = peer.call(peerId, myStream);
  call.on("stream", (remoteStream) => {
    remoteVideo.srcObject = remoteStream;
  });
}

socket.on("new-user", (usersList) => {
  console.log("New User Joined the server all users:", usersList);
  usersList.forEach((item) => {
    if (item.socketId !== mySocketId) {
      usersContainer.innerHTML = "";
      createUserElement(item);
    }
  });
});

socket.on("users", (usersList) => {
  console.log("Get Initial User on first load, users list:", usersList);
  usersList.forEach((item) => {
    if (item.socketId !== mySocketId) {
      createUserElement(item);
    }
  });
});

const myVideo = document.getElementById("myVideo");
const remoteVideo = document.getElementById("remoteVideo");

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myStream = stream;
    myVideo.srcObject = stream;

    // Answer incoming calls
    peer.on("call", (call) => {
      console.log("Someone is calling you", call);
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });
    });
  });
