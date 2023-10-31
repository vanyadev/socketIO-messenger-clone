const menuIcon = document.getElementById('menu-icon');
const sidebar = document.getElementById('mySidebar');
const roomLists = document.querySelectorAll('.room-list');
const rooms = document.querySelectorAll('.rooms');

rooms.forEach((room) => {
  for (let i = 0; i < room.children.length; i++) {
    const roomsGroup = room.children[i];
    const pointer = roomsGroup.firstElementChild;
    const roomList = roomsGroup.lastElementChild;

    pointer.addEventListener('click', () => {
      const upIcon = document.createElement('i');
      upIcon.classList.value = 'room-caret fa-solid fa-caret-up';
      const downIcon = document.createElement('i');
      downIcon.classList.value = 'room-caret fa-solid fa-caret-down';
      pointer.classList.toggle('hidden');

      if (pointer.firstElementChild.classList.contains('fa-caret-up')) {
        pointer.replaceChild(downIcon, pointer.firstElementChild);
        roomList.style.display = 'block';
      } else {
        pointer.replaceChild(upIcon, pointer.firstElementChild);
        roomList.style.display = 'none';
      }
    });
  }
});

menuIcon.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  const isActive = sidebar.classList.contains('active');

  if (!isActive) {
    return;
  }

  const clickedOnMenuIcon =
    e.target.classList.contains('line') ||
    e.target.classList.contains('menu-icon');

  if (!e.target.closest('.rooms') && isActive && !clickedOnMenuIcon) {
    sidebar.classList.remove('active');
  }
});

const buildMessageHTML = ({ newMessage, userName, date, avatar }) => {
  const formattedDate = new Date(date).toLocaleString();

  return `
    <li>
      <div class="user-image">
        <img src="${avatar}" />
      </div>
      <div class="user-message">
        <div class="user-name-time">${userName}<span>${formattedDate}</span></div>
        <div class="message-text">${newMessage}</div>
      </div>
    </li>`;
};
