const fs = require('fs');

const fileHandler = function (nameFile) {
    const file = fs.createWriteStream(nameFile);
    const deleteFile = () => {
        fs.unlink(nameFile, function (err) {
            if (err) return console.log(err);
            console.log('file deleted successfully');
        });
    }
    const writeUpdateView = (data) => {
        data.forEach((item) => {
            file.write(`UPDATE analytics SET video_view = analytics.video_view + ${item.subtract} WHERE video_id='${item.videoId}'; \r\n`)
        })
        file.end()
    }
    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min); //The maximum is 
      }
    const writeUpdateErrorView = (data) => {
        data.forEach((item) => {
           const viewIncrease = getRandomInt(100,300)
            file.write(`UPDATE analytics SET video_view = (analytics.video_view + ${item.db1View} - ${item.db2View} + ${viewIncrease}) WHERE video_id='${item.videoId}'; \r\n`)
        })
        file.end()
    }

    return { deleteFile, writeUpdateView,writeUpdateErrorView }
}

module.exports = fileHandler
