// codeBlock.js
const URL_SERVER = 'http://localhost:3000'
const codeEditor = document.getElementById('code-editor');
const highlightedCode = document.getElementById('highlighted-code');
const codeTitle = document.getElementById('code-title');
const roleTitle = document.getElementById('role-title');

function codeHighlight(highlightedCode, code){
  // Highlight the code and update the highlighted code element
  highlightedCode.innerHTML = hljs.highlightAuto(code).value;
}

//checks if the code match to the solutio and put a smiley if correct.
function solutionCheck(code, solution){
  if (code.trim() === solution.trim()){
    document.getElementById("smiley-image").style.visibility=  "visible";
    console.log("correct")
  }
  else{
    document.getElementById("smiley-image").style.visibility=  "hidden";
  }
}

function roleTitleEdit(role){
  
  // Enable or disable code editing based on user's role
  if (role === 'mentor') {
    document.getElementById('code-editor').disabled = true;
  } else {
    document.getElementById('code-editor').disabled = false;
  }
  roleTitle.innerHTML = "Hey " + role;
}

document.addEventListener('DOMContentLoaded' , async () => {
  // Initialize Highlight.js
  hljs.highlightAll();

  // Establish WebSocket connection
  const socket = io();

  // Function to select a room
  function selectRoom(roomName) {
    socket.emit('selectRoom', roomName);
  }

  // Exctract CodeBlock Name from the URL
  const urlParam = new URLSearchParams(window.location.search);
  const codeBlockName = urlParam.get('codeBlock');

  // Select the room based on the room name from URL parameters
  selectRoom(codeBlockName);

  // Log when the connection is established
  socket.on('connect', () => {
    console.log('Connected to server');

    // Request role from the server
  socket.emit('requestRole');
  });


  // Listen for server response with the role
  socket.on('roleResponse', (data) => {
    const { role } = data;
    console.log(`Your role is ${role}`);

    roleTitleEdit(role);

  });


  //sets the title to match the currect code Block
  codeTitle.innerHTML = codeBlockName;

  // Fetch code block details from the backend
  const response = await fetch(`${URL_SERVER}/codeBlock/${codeBlockName}`);

  const { title, code , solution} = await response.json();
  console.log("the code:" + code)
  console.log("the solution:" + solution)

 
  // Display code block details on the page
  document.getElementById('code-title').innerText = title;
  codeEditor.innerHTML = code;
  codeHighlight(highlightedCode, code);


  //Listen for code changes in the code editor and send to the server
  codeEditor.addEventListener('input', () => {
    const code = codeEditor.value;
    socket.emit('codeChange', { code });
    solutionCheck(code, solution);
    
  });

  // Listen for code changes from the server and update the code editor
  socket.on('codeChange', (data) => {
    const { code } = data;
    codeEditor.value = code;
    codeHighlight(highlightedCode, code);
  });
});
