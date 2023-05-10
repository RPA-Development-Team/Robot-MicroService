exports.robotQueryList = {
    GET_ALL_ROBOTS: 'SELECT id, "createdAt", "updatedAt", "robotName", "robotAddress", connected, "socketID", "userID" FROM public."Robot";',
    GET_ROBOT_BY_SOCKET_ID: 'SELECT * FROM Robot WHERE socketID=$1',
    GET_ROBOT_BY_NAME: 'SELECT * FROM Robot WHERE robotNname=$1',
    INSERT_ROBOT: 'INSERT INTO Robot (updatedAt, robotName, robotAddress, connected, socketID, userID,) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    DELETE_ROBOT: 'DELETE FROM Robot WHERE robotNname=$1'
}

