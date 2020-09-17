const express = require('express');
const path = require('path');
const app = express();
const socket = require('socket.io');

const messages = [];
let users = [];

app.use(express.static(`${__dirname}/client`));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/index.html'));
});

const server = app.listen(8000, () => {
    console.log('Server is running on Port:', 8000);
});
const io = socket(server);

io.on('connection', (socket) => {
    console.log('New client! Its id – ' + socket.id);
    socket.on('join', (user) => {
        console.log('Oh, I\'ve got some user ' + socket.id);
        users.push(user);
        console.log(users);
        socket.broadcast.emit('newUser', user);
    });
    socket.on('message', (message) => {
        console.log('Oh, I\'ve got something from ' + socket.id);
        messages.push(message);
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', () => {
        console.log('Oh, socket ' + socket.id + ' has left')

        const removeUser = users.filter(user => user.id === socket.id);
        console.log('remove', removeUser[0]);
        socket.broadcast.emit('removeUser', removeUser[0]);

        const updateUsers = users.filter(user => user.id !== socket.id);
        users = updateUsers;
        console.log(users);
    });
    console.log('I\'ve added a listener on message and disconnect events \n');
});