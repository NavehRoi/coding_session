// backend/socket.js
const mentors = new Map(); // Map to store mentors by room

function disconnectMentor(socket){
    // Check if the disconnecting client is a mentor and remove them from mentors list
    if (socket === mentors.get(socket.room)) {
        console.log('Mentor disconnected. Resetting mentor status.');
        mentors.delete(socket.room);
    }
}

//Assign the specific socket to the Room it is in.
function connectRoom(socket , room){
     // Leave current room
     if (socket.room) {
        socket.leave(socket.room);
    }
    // Join new room
    socket.join(room);
    socket.room = room;
    console.log(`Client joined room: ${room}`);

    //assign mentor to the room if not exist, and handle Role.
    connectMentor(socket , room);
}

//Role assignment to the socket
function connectMentor(socket , room){
    // Check if mentor exists for this room
    if (!mentors.has(room)) {
        // If no mentor, assign the current connection as mentor
        mentors.set(room, socket);
        socket.emit('roleResponse', { role: 'mentor' });
    } else {
        socket.emit('roleResponse', { role: 'student' });
    }
}

function setupSocket(io) {
    // Socket.IO connection handling
    io.on('connection', socket => {
        console.log('A client connected');

        // Listen for room selection event
        socket.on('selectRoom', room => {
            connectRoom(socket , room);
        });

        // Listen for disconnect event
        socket.on('disconnect', () => {
            console.log('A client disconnected');
            disconnectMentor(socket);
            
        });
        //Listen for code changing event.
        socket.on('codeChange', data => {
            const { code } = data;
            io.to(socket.room).emit('codeChange', { code });
        });
    });
}
module.exports = setupSocket; // Exporting the function
