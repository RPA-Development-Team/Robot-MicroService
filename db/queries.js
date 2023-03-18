exports.machineQueryList = {
    GET_ALL_MACHINES: 'SELECT * FROM machines',
    GET_MACHINE_BY_SOCKET_ID: 'SELECT * FROM machines WHERE socketid=$1',
    GET_MACHINE_BY_NAME: 'SELECT * FROM machines WHERE name=$1',
    INSERT_MACHINE: 'INSERT INTO machines (name, type, socketId) VALUES ($1, $2, $3) RETURNING *',
    DELETE_MACHINE: 'DELETE FROM machines WHERE name=$1'
}

