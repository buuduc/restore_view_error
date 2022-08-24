const pg = require('pg')
const { Pool, Client } = pg

const createConfig = (connectionString) => ({
    connectionString,
    // ssl: {
    //     rejectUnauthorized: false // This line will fix new error
    // }
})

const createConnection = async (connectionString) => {
    const config = createConfig(connectionString)
    const backupPool = new Client(config)
    await backupPool.connect()
    return backupPool
}


module.exports = createConnection
