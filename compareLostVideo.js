require('dotenv').config()
const fs = require('fs');

const liveUri = process.env.LIVE_URI
const backUpUri = process.env.BACKUP_URI
const getDataQuery = require('./helpers/getDataQuery')



const writeReport = ({ backupData, liveData, fileName, fieldCompare, tableName }) => {
    // let tableName= 'videos'
    // let fieldCompare='id'
    const liveDataInit = { ...liveData }
    console.log('file: compareLostVideo.js # line 15 # writeReport # liveDataInit', Object.keys(liveDataInit))
    const { channelsDetail } = backupData
    const liveDataTable = [...liveDataInit[tableName]]
    let backUpLength = backupData[tableName].length
    let liveLength = liveData[tableName].length
    let totalRun = 0
    let totalDelete =0
    for (let i = 0; i < liveDataTable.length; i++) {
        console.log('file: compareLostVideo.js # line 21 # writeReport #  liveDataInit[tableName].length',  liveDataInit[tableName].length)
        totalRun++
        const videoId = liveDataTable[i][fieldCompare]
        // console.log('file: compareLostVideo.js # line 17 # ; # videoId', videoId)
        const indexInBackUp = backupData[tableName].findIndex((item) => item[fieldCompare] == videoId)
        if (indexInBackUp != -1) {
            totalDelete++
            indexLive = liveData[tableName].findIndex((item) => item[fieldCompare] == videoId)
            liveData[tableName].splice(indexLive, 1)
            backupData[tableName].splice(indexInBackUp, 1)
        }
        
    }
    console.log('file: compareLostVideo.js # line 19 # writeReport # totalRun', totalRun)
    console.log('file: compareLostVideo.js # line 20 # writeReport # totalDelete', totalDelete)
    var file = fs.createWriteStream(fileName);
    file.write(`COMPARE ${tableName.toUpperCase()} DATABASE \n`)
    file.write('************************** \n')
    file.write(`Channel Id: ${channelsDetail.id} \n`)
    file.write(`Name Channels: ${channelsDetail.name} \n`)
    file.write(`Short Url: ${channelsDetail.short_url} \n`)
    file.write(`Length Backup Field: ${backUpLength} \n`)
    file.write(`Length Live Field: ${liveLength} \n`)
    file.write(`Table Name: ${tableName}\n`)
    file.write(`Field Compare: ${fieldCompare}\n`)
    file.write('************************** \n \n')
    file.write(`List ${fieldCompare} only available in BACKUP (${backupData[tableName].length}): \n`)
    backupData[tableName].forEach(function (item) { 
        file.write(`${item[fieldCompare]} -- ${item.name? item.name: `${item.video_view} views` }`+ '\n')  
    
    });
    file.write('\n \n ************************************ \n \n')
    file.write(`List  ${fieldCompare} only available in LIVE (${liveData[tableName].length}): \n`)
    liveData[tableName].forEach(function (item) { file.write(`${item[fieldCompare]} -- ${item.name? item.name: `${item.video_views} views` }`+ '\n') });
    file.end();

    const jsonBackupFile = fs.createWriteStream(`backup_data_${tableName}.json`)
    jsonBackupFile.write(JSON.stringify(backupData[tableName]))
    jsonBackupFile.end()
}


    ; (async () => {
        try {
            urlChannel = 'wrp'
            channel_id = '74c28ff1-3deb-4476-b278-56559cb3e3a2'
            const backupData = await getDataQuery({ connectionString: backUpUri, urlChannel, channel_id })
            const liveData = await getDataQuery({ connectionString: liveUri, urlChannel,channel_id })
            // console.log('file: compareLostVideo.js # line 50 # ; # backupData', backupData.channelsDetail)
            // console.log('file: compareLostVideo.js # line 52 # ; # liveData', liveData.channelsDetail)

            writeReport({
                backupData: backupData,
                liveData,
                fileName: `./reportVideos_${urlChannel}.txt`,
                fieldCompare: 'id',
                tableName: 'videos'
            })
            writeReport({
                backupData: backupData,
                liveData,
                fileName: `./reportAnalytics_${urlChannel}.txt`,
                fieldCompare: 'video_id',
                tableName: 'analytics'
            })






        } catch (error) {
            console.log('file: compareLostVideo.js # line 20 # ; # error', error)
        }
    })()
