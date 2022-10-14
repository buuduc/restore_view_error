const fs = require('fs');

const fileHandler = function (nameFile) {
    const file = fs.createWriteStream(nameFile);
    const deleteFile = () => {
        fs.unlink(nameFile, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    }
    const writeUpdateUrl = (data) => {
        data.forEach((item) => {
            file.write(`UPDATE channels SET thumbnail_url = '${item.thumbnail_url}' WHERE id='${item.id}'; \r\n`)
        })
        file.end()
    }

    const writeUpdateUrlError = (data) => {
        data.forEach((item) => {
            file.write(`thumbnail_error: ${item.thumbnail_url} \r\nshort_url = https://www.brighteon.com/channels/${item.short_url} \r\n\r\n`)
        })
        file.end()
    }

    return { deleteFile, writeUpdateUrl, writeUpdateUrlError }
}

module.exports = fileHandler
