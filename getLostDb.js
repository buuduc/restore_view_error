require('dotenv').config()
const fs = require('fs');
const fileHandle = require('./helpers/fileHandle')

const uri = process.env.URI
const createConnection = require('./helpers/createConnection')




    ; (async () => {
        const newUrlList = [],
            urlErrorList = []
        try {
            const db = await createConnection(uri)
            const data = await db.query(`SELECT id, thumbnail_url, short_url from channels where thumbnail_key is null and thumbnail_url is not null and thumbnail_url like '%https://avatars.brighteon.com%';`)
            console.log("🚀 ~ file: getLostDb.js ~ line 17 ~ ; ~ data", data.rows.length)
            await Promise.all(
                data.rows.map(channel => {
                    if (!channel.thumbnail_url.includes('file/brighteon-avatars')) {
                        const newUrl = channel.thumbnail_url.substr(channel.thumbnail_url.lastIndexOf('/'))
                        urlErrorList.push(channel)
                        newUrlList.push({ id: channel.id, thumbnail_url: `https://avatars.brighteon.com/file/brighteon-avatars${newUrl}` })
                    }
                })
            )

            const fileHandler = fileHandle('restore_url_avatar.sql')
            fileHandler.writeUpdateUrl(newUrlList)
            const fileHandlerError = fileHandle('restore_url_avatar_error.sql')
            fileHandlerError.writeUpdateUrlError(urlErrorList)

            console.log('done')
            await db.end()

        } catch (error) {
            console.log("🚀 ~ file: getLostDb.js ~ line 29 ~ ; ~ error", error)
        }
        finally {
            // await db1.end()
            //   await  db2.end()
        }
    })()
