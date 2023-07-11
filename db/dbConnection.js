require('dotenv').config();
const {Pool} = require('pg');
const {dbLogger} = require('../utils/dbLogger')

//Create new connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//Database query method
exports.dbQuery = async(queryText, queryParams) => {
    try{
        const res = await pool.query(queryText, queryParams);
        dbLogger.log('\nExecuted query successfully.....', {query:queryText, result: res.rows});
        return res.rows;
    }catch(err){
        dbLogger.log('Failed to execute query.....', {query:queryText, result: err.message});
        throw err;
    }
}
