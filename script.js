let mySocketId = "";
let myStream = null;
const socket = io("http://localhost:4000");

let peer = null;

// Listen for connection
socket.on("connect", () => {
  console.log("Connected to server with ID:", socket.id);
  peer = new Peer(socket.id);
  mySocketId = socket.id;
});

const usersContainer = document.querySelector(".users-container");

function createUserElement(item) {
  const element = document.createElement("div");
  element.innerHTML = `<div>${new Date(item.joinedAt).toLocaleString()}</div>
    <button data-id=${mySocketId} ${(onclick = function () {
    callUser(item.socketId);
  })} >Call</button>`;
  usersContainer.appendChild(element);
}

function callUser(peerId) {
  console.log("Call user clicled", peerId);
  const call = peer.call(peerId, myStream);
  call.on("stream", (remoteStream) => {
    remoteVideo.srcObject = remoteStream;
  });
}

socket.on("new-user", (usersList) => {
  console.log("new User Joined", usersList);
  usersList.forEach((item) => {
    if (item.socketId !== mySocketId) {
      usersContainer.innerHTML = "";
      createUserElement(item);
    }
  });
});

socket.on("users", (usersList) => {
  console.log("Initial Users List", usersList);
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
      console.log("CALL COMING---", call);
      call.answer(stream);
      call.on("stream", (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
      });
    });
  });
