require('dotenv').config()
const fs = require('fs');
const fileHandle = require('./helpers/fileHandle')

const uri1 = process.env.URI1
const uri2 = process.env.URI2
const createConnection = require('./helpers/createConnection')




    ; (async () => {
        const viewIncreaseList = [],
            viewErrorList = []
        try {
            const db2 = await createConnection(uri2)
            const db1 = await createConnection(uri1)
            //* step 1: get data in db 2 to found the problem
            const listId = fs.readFileSync('./assets/video_view_cache.txt').toString().split("\r\n");
            console.log('🚀 🚀 file: getLostDb.js 🚀 line 20 🚀 ; 🚀 listId', listId)
            // const listId = ['9bf4cd77-f30a-4456-b1a5-0b676c89c364']
            console.log('🚀 🚀 file: getLostDb.js 🚀 line 20 🚀 ; 🚀 listId', listId)
            await Promise.all(listId.map(async (id) => {
                console.log('🚀 🚀 file: getLostDb.js 🚀 line 22 🚀 awaitPromise.all 🚀 id', id)
                if(!id) return
                const { rows: [db1Data] } = await db1.query(`SELECT * from analytics where video_id='${id}';`)
                console.log('🚀 🚀 file: getLostDb.js 🚀 line 25 🚀 awaitPromise.all 🚀 db1Data', db1Data)
                const { rows: [db2Data] } = await db2.query(`SELECT * from analytics where video_id='${id}';`)
                const returnData = { videoId: db2Data.video_id }
                console.log('🚀 🚀 file: getLostDb.js 🚀 line 28 🚀 awaitPromise.all 🚀 db2Data', db2Data)
                returnData.db2View = db2Data.video_view
                if (db1Data) {
                    returnData.db1View = db1Data.video_view
                    returnData.subtract = db2Data.video_view - db1Data.video_view
                } else {
                    //* for new video
                    returnData.subtract = db2Data.video_view
                }
                if (returnData.subtract === 0) return

                if ((db1Data && db2Data.video_view > 30000 && db2Data.video_view / db1Data.video_view > 10)) {
                    console.log('the data unexpected:', returnData)
                    viewErrorList.push(returnData)
                } else {
                    console.log('the good data',returnData)
                    viewIncreaseList.push(returnData)
                }
            }))
            console.log(viewErrorList)

            const fileHandler = fileHandle('restore_view.sql')
            fileHandler.deleteFile()
            fileHandler.writeUpdateView(viewIncreaseList)

            const fileHandlerError = fileHandle('restore_view_error.sql')
            fileHandlerError.deleteFile()
            fileHandlerError.writeUpdateErrorView(viewErrorList)

            await db1.end()
            await db2.end()

        } catch (error) {
        }
        finally {
            // await db1.end()
            //   await  db2.end()
        }
    })()
