var socket = io();

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const metaDataForm = document.getElementById('metaData-form');
const metaDataInput = document.getElementById('metaData-input');

const packageForm = document.getElementById('package-form');
const packageInput = document.getElementById('package-input');

messageForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(messageInput.value){
        socket.emit('client robot message', messageInput.value);
        messageInput.value='';
    }
})

metaDataForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(metaDataInput.value){
        socket.emit('client robot metaData', metaDataInput.value);
        metaDataInput.value='';
    }
})

packageForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(packageInput.value){
        console.log(`At Client socket-id: ${socket.id}`);
        socket.emit('studio package metaData', packageInput.value);
        packageInput.value='';
    }
})

socket.on('notification', function(obj){
    let {msg, pkgMetaData} = obj;
    console.log("received at client...", msg, pkgMetaData);
});



