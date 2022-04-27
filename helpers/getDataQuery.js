const pg = require('pg')
const { Pool, Client } = pg

const createConfig = (connectionString) => ({
    connectionString,
    ssl: {
        rejectUnauthorized: false // This line will fix new error
    }
})
const getDataQuery = async ({connectionString, urlChannel, channel_id })=>{
    const config = createConfig(connectionString)
    const backupPool = new Client(config)
    await backupPool.connect()
    // const res =await backupPool.query('SELECT NOW()')
    let { rows: channelsDetail } = channel_id 
    ? await backupPool.query('SELECT * FROM channels where id= $1 limit 1',[channel_id])
    : await backupPool.query('SELECT * FROM channels where short_url= $1 limit 1',[urlChannel])
    console.log('file: getDataQuery.js # line 11 # getDataQuery # connectionString', connectionString)
    console.log('file: getDataQuery.js # line 16 # getDataQuery # channel_id', channel_id)
    channelsDetail=channelsDetail[0]
    const channelId = channelsDetail.id
    const { rows: analytics } = await backupPool.query('SELECT * FROM analytics where channel_id= $1',[channelId])
    const { rows: videos } = await backupPool.query('SELECT * FROM videos where channel_id= $1',[channelId])





      
    await backupPool.end()
return {
    channelsDetail,
    analytics,
    videos
}
}

module.exports = getDataQuery
