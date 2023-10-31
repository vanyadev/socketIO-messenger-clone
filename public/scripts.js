const userName = prompt('username:');
const password = prompt('password:');
const clientOptions = {
  query: {
    userName,
    password,
  },
  auth: {
    userName,
    password,
  },
};
const socket = io();
const namespaceSockets = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

let selectedNsId = 0;
document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const input = document.querySelector('#user-message');
  const newMessage = input.value;

  namespaceSockets[selectedNsId].emit('newMessageToRoom', {
    newMessage,
    date: Date.now(),
    avatar:
      'https://img.freepik.com/premium-vector/3d-realistic-person-people-vector-illustration_156780-269.jpg',
    userName,
    selectedNsId,
  });

  input.value = '';
});

const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    namespaceSockets[nsId].on('messageToRoom', (messageObj) => {
      document.querySelector('#messages').innerHTML +=
        buildMessageHTML(messageObj);
    });
    listeners.messageToRoom[nsId] = true;
  }
};

socket.on('connect', () => {
  socket.emit('clientConnect');
});

socket.on('nsList', (nsData) => {
  const lastNs = Number(localStorage.getItem('lastNs'));
  const namespacesDiv = document.querySelector('#namespaces-container');
  namespacesDiv.innerHTML = '';

  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src=${ns.image} /></div>`;

    if (!namespaceSockets[ns.id]) {
      namespaceSockets[ns.id] = io(ns.endpoint);
    }

    addListeners(ns.id);
  });

  Array.from(document.getElementsByClassName('namespace')).forEach(
    (element) => {
      element.addEventListener('click', (e) => {
        joinNs(element, nsData);
      });
    }
  );

  joinNs(document.getElementsByClassName('namespace')[lastNs], nsData);
});
