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
            const { rows: db2DataList } = await db2.query("SELECT * from analytics where updated_at between '2022-08-20' and '2022-08-23'")

            await Promise.all(db2DataList.map(async (db2Data) => {
                const { rows: [db1Data] } = await db1.query(`SELECT * from analytics where video_id='${db2Data.video_id}';`)
                const returnData = { videoId: db2Data.video_id }
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
                    viewErrorList.push(returnData)
                } else {
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
            console.log('file: compareLostVideo.js # line 20 # ; # error', error)
        }
        finally {
            // await db1.end()
            //   await  db2.end()
        }
    })()
