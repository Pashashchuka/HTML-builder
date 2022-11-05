const fs = require('fs')
const path = require('path')
const { readdir, copyFile } = require('fs/promises')

const copyFilePath = path.join(__dirname, 'files-copy');

fs.mkdir(copyFilePath, { recursive: true }, () => {})

async function copyDir() {
    try {
        const copies = await readdir(copyFilePath);
        const files = await readdir(path.join(__dirname, 'files'));

        for (const copy of copies) {
            fs.unlink(path.join(__dirname, `./files-copy/${copy}`), () => {})
        }
        for (const file of files) {
            copyFile(path.join(__dirname, `./files/${file}`), path.join(__dirname, `./files-copy/${file}`))
        }
    }
    catch {}
}

copyDir()