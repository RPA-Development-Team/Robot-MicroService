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
        socket.emit('client message', messageInput.value);
        messageInput.value='';
    }
})

metaDataForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(metaDataInput.value){
        socket.emit('client metaData', metaDataInput.value);
        metaDataInput.value='';
    }
})

packageForm.addEventListener('submit', function(e){
    e.preventDefault();
    if(packageInput.value){
        socket.emit('client package', packageInput.value);
        packageInput.value='';
    }
})



