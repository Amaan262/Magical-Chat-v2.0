const socket = io();

var username;

var chats = document.querySelector('.chats'); // for joined left function
var users_list = document.querySelector('.user-list');
var users_count = document.querySelector('.user-count');

var send_btn = document.querySelector('#send-btn');
var msg_input = document.querySelector('#msg-input');


do{
    username = prompt("Enter you Name to use Magical Chat App")
}while(!username);

socket.emit("new-user-joined",username);
 
socket.on('user-connected',(user)=>{
    userJoinLeft(user, 'joined');
});

socket.on('user-disconnected',(user)=>{
    userJoinLeft(user,'left');
})


function userJoinLeft(name,status) {

    let div = document.createElement('div');
    div.classList.add('user-join');
    let content = `<p> <b> ${name} </b> ${status} the chat</p>`;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;

    
}

socket.on('user-list',(users)=>{
    users_list.innerHTML = "";
    users_arr = Object.values(users);
    for(i=0; i <users_arr.length; i++){
        let p = document.createElement('p');
        p.innerText =  (i+1)+ ". " + users_arr[i] ;
        users_list.appendChild(p);
        users_count.innerHTML = users_arr.length;
    }
});

send_btn.addEventListener('click',()=>{
    let data = {
        user : username,
        msg : msg_input.value
    };
    if (msg_input.value!='') {
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        msg_input.value = '';
        
    }
});

msg_input.addEventListener('keyup',(e)=>{
    let data = {
        user : username,
        msg : msg_input.value
    };
    if (msg_input.value!='' && e.key === 'Enter') {
        appendMessage(data,'outgoing');
        socket.emit('message',data);
        msg_input.value = '';
        
    }
});

function appendMessage(data,status) {
    let div = document.createElement('div');
    div.classList.add('message',status);
    let content = `<h4>${data.user}</h4>
                   <p>${data.msg}</p> `;
    div.innerHTML = content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight;
        
}


socket.on('message',(data)=>{
    appendMessage(data,'incoming');
});
