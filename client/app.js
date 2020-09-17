const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');
const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('join', ({ name, id }) => addMessage(name, id));
socket.on('newUser', ({ name }) => addMessage( `Chat Bot` ,`${name} has joined the conversation!`));
socket.on('removeUser', ({ name }) => addMessage( `Chat Bot` ,`${name} has left the conversation!`));

let userName = null;

function login(e) {
    e.preventDefault();
    if (!userNameInput.value) {
        alert('enter correct name');
        return;
    } else {
        userName = userNameInput.value;
        loginForm.classList.remove('show');
        messagesSection.classList.add('show');
        socket.emit('join', { name: userName, id: socket.id });
    }
}

function sendMessage(e) {
    e.preventDefault();
    let messageContent = messageContentInput.value;
    if (!messageContent.length) {
        alert('enter something');
        return;
    } else {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent });
        messageContentInput.value = null;
    }
}

function addMessage(author, content) {
    const message = document.createElement("li");
    message.classList.add('message--received');
    message.classList.add('message');

    if (author === userName) {
        message.classList.add('message--self');
    }
    if (author === `Chat Bot`) {
        message.classList.add('message--bot');
    }
    const h3 = document.createElement("h3");
    h3.classList.add('message__author');
    author === userName ? h3.innerText = 'You' : h3.innerText = author;
    const div = document.createElement("div");
    div.classList.add('message__content');
    div.innerText = content;
  
    message.appendChild(h3);
    message.appendChild(div);
    messagesList.appendChild(message);
}

loginForm.addEventListener('submit', login);
messagesSection.addEventListener('submit', sendMessage);