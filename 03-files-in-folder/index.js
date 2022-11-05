const fs = require('fs');
const path = require('path');
const direction = path.resolve('03-files-in-folder', 'secret-folder')

const folderPath = `03-files-in-folder/secret-folder/`

fs.readdir(direction, { withFileTypes: true }, (_, items) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].isFile()) {
            const fullFileName = items[i].name;
            const fileType = path.extname(fullFileName).slice(1, 4);
            const fileName = fullFileName.split('.').slice(0, -1);

            fs.stat(`${folderPath}${fullFileName}`, (_, stats) => {
                const fileSize = (stats.size / 1024).toFixed(3)

                console.log(`${fileName} - ${fileType} - ${fileSize}kb`);
            })
        }
    }
})