//This is a web-Socket client used in browser to test the server functionality
const socket = new WebSocket("ws://localhost:4000/")

const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

const metaDataForm = document.getElementById('metaData-form');
const metaDataInput = document.getElementById('metaData-input');

const packageForm = document.getElementById('package-form');
const packageInput = document.getElementById('package-input');

//Establishing connection
socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established.');
});

//Message input
// messageForm.addEventListener('submit', function(e){
//     e.preventDefault();
//     if(messageInput.value){
//         socket.send('client robot message', messageInput.value);
//         messageInput.value='';
//     }
// })

//Meta-data input
metaDataForm.addEventListener('submit', function(e){
    e.preventDefault();
    try{
        if(metaDataInput.value){
            const data = {
                event: 'client robot metaData',
                value: metaDataInput.value
            }
            socket.send(JSON.stringify(data));
            metaDataInput.value='';
        }
    }catch(err){
        console.log(`Error: ${err.message}`)
        throw err
    }
})

//Package input
// packageForm.addEventListener('submit', function(e){
//     e.preventDefault();
//     if(packageInput.value){
//         console.log(`At Client socket-id: ${socket.id}`);
//         socket.send('studio package metaData', packageInput.value);
//         packageInput.value='';
//     }
// })

//Handling scheduler notitfications
// socket.addEventListener('notification', (event) => {
//     let {msg, pkgMetaData} = event.detail;
//     console.log("received at client...", msg, pkgMetaData);
// });



