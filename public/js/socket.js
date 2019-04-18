const socket = io();

socket.on('comments', data => {
    console.log(data);
});

