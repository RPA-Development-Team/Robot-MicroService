exports.robotQueryList = {
    GET_ALL_ROBOTS: 'SELECT * FROM "Robot"',
    GET_ROBOT_BY_SOCKET_ID: 'SELECT * FROM "Robot" WHERE "socketID"=$1',
    GET_ROBOT_BY_NAME: 'SELECT * FROM "Robot" WHERE "robotName"=$1',
    GET_ROBOT_BY_ADDRESS: 'SELECT * FROM "Robot" WHERE "robotAddress"=$1',
    INSERT_ROBOT: 'INSERT INTO "Robot" ("updatedAt", "robotName", "robotAddress", "socketID", "userID") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    UPDATE_ROBOT_STATUS: 'UPDATE "Robot" SET "updatedAt"=$1, connected=$2, "socketID"=$3 WHERE "robotAddress"=$4',
    DELETE_ROBOT: 'DELETE FROM "Robot" WHERE "robotName"=$1'
}

