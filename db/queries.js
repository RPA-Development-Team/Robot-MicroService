exports.machineQueryList = {
    GET_ALL_MACHINES: 'SELECT * FROM machines',
    GET_MACHINE_BY_ID: 'SELECT * FROM machines WHERE id=$1',
    GET_MACHINE_BY_NAME: 'SELECT * FROM machines WHERE name=$1',
    INSERT_MACHINE: 'INSERT INTO machines (name, type) VALUES ($1, $2)'
}

