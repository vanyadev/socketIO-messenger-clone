const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute('ns');
  const clickedNs = nsData.find((row) => row.endpoint === nsEndpoint);
  selectedNsId = clickedNs.id;
  const rooms = clickedNs.rooms;
  let roomLists = document.querySelectorAll('.room-list');

  roomLists.forEach((roomList) => {
    if (!roomList.parentElement.classList.contains('dm')) {
      roomList.innerHTML = '';
    }
  });

  roomLists.forEach((roomList) => {
    if (!roomList.parentElement.classList.contains('dm')) {
      let firstRoom;
      rooms.forEach((room, i) => {
        if (i === 0) {
          firstRoom = room.roomTitle;
        }

        roomList.innerHTML += `<li class="room" namespaceId=${room.namespaceId}>
          <span class="fa-solid fa-${
            room.privateRoom ? 'lock' : 'globe'
          }"></span>${room.roomTitle}
        </li>`;
      });

      joinRoom(firstRoom, selectedNsId);

      const roomNodes = document.querySelectorAll('.room');
      const sidebar = document.getElementById('mySidebar');
      roomNodes.forEach((elem) => {
        elem.addEventListener('click', (e) => {
          const namespaceId = elem.getAttribute('namespaceId');

          joinRoom(e.target.innerText, namespaceId);
          sidebar.classList.remove('active');
        });
      });
    }
  });

  localStorage.setItem('lastNs', selectedNsId);
};
