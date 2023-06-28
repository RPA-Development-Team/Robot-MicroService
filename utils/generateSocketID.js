const clients = new Map()
const { v4: uuidv4 } = require('uuid');

exports.GenerateSocketID = function(){
    const socketID = uuidv4()
    return socketID
}

