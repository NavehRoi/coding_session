# coding_session
 
## Online Coding Web Application
This project is an online coding web application designed to facilitate remote coding sessions between mentors and students. It allows mentors to share code blocks with students, observe their changes in real-time, and provide guidance as needed.

## Features
### Lobby Page:
Displays a list of code blocks for users to choose from.

### Code Block Page:
Supports two different roles: mentor and student.
The mentor sees the code block in read-only mode.
The student can edit the code block and see real-time changes.
Real-time synchronization of code changes using Socket.IO.
Syntax highlighting using Highlight.js.
Ability to display a smiley face when the student's code matches the solution.


## Technologies Used
### Frontend:
HTML, 
CSS (Bootstrap), 
JavaScript, 
Socket.IO for real-time communication, 
Highlight.js for syntax highlighting

### Backend:
Node.js with Express.js for the server, 
MongoDB for data storage, 
Mongoose for MongoDB object modeling, 
Socket.IO for real-time communication
