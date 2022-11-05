const fs = require('fs');
const { unlink, readdir, mkdir, writeFile, copyFile, rmdir, readFile } = require('fs/promises');
const path = require('path');

const arrStyles = [];

const founfFiles = async () => {
    const all = await readdir(path.join(__dirname))
    const find = all.find((el) => el === 'project-dist')

    return find ? await removeAll('project-dist') : await addFiles()
}

const removeAll = async (removeParam) => {
    try {
        const files = await readdir(path.join(__dirname, removeParam));

        for (const file of files) {
            const removePath = `${removeParam}/${file}`;

            if (file) {
                if (!!path.extname(file)) {
                    await unlink(path.join(__dirname, removePath));
                } else {
                    const filesIn = await readdir(path.join(__dirname, removePath));
                    if (filesIn) {
                        await removeAll(removePath);
                    } else {
                        await rmdir(path.join(__dirname, removePath));
                    }
                }
            }
        }
    } catch { }
}

const addFiles = async () => {
    const filePath = path.join(__dirname, 'project-dist');
    const newFilePath = path.join(__dirname, 'project-dist', 'style.css');

    try {
        await mkdir(filePath), { recursive: true };
        await writeFile(newFilePath, '');
    }
    catch { }
}

const copyAll = async (param) => {
    try {
        const files = await readdir(path.join(__dirname, param));
        for (const file of files) {
            const paramPath = `${param}/${file}`

            if (!!path.extname(file)) {
                await copyFile(path.join(__dirname, paramPath), path.join(__dirname, `project-dist/${paramPath}`));
            } else {
                await mkdir(path.join(__dirname, `project-dist/${paramPath}`), { recursive: true });
                await copyAll(`${paramPath}`);
            }
        }
    } catch { }
}

const copyStyles = async () => {
    try {
        const styleFiles = await readdir(path.join(__dirname, 'styles'));
        for (const file of styleFiles) {
            if (path.extname(file) == '.css') {
                const filePath = path.join(__dirname, `./styles/${file}`);
                const reatableStream = fs.createReadStream(filePath, 'utf-8');
                reatableStream.on('data', chunk => {
                    arrStyles.push(chunk);
                });
                reatableStream.on('end', () => {
                    const writebleStream = fs.createWriteStream(path.join(__dirname, `./project-dist/style.css`));
                    arrStyles.forEach(el => writebleStream.write(el + '\n'));
                    writebleStream.end();
                });
            }
        }
    } catch { }
}

const copyHtml = async () => {
    const componentArr = await readdir(path.join(__dirname, 'components'));
    const componentText = componentArr.map(el => `{{${path.parse(el).name}}}`);
    const readPath = path.join(__dirname, 'template.html');
    const writePath = path.join(__dirname, 'project-dist', 'index.html');
    const readStream = fs.createReadStream(readPath, 'utf-8');
    let tempHtml = '';

    readStream.on('data', chank => tempHtml += chank);
    readStream.on('end', async () => {
        let arrHtml = tempHtml.split('\r\n');
        const writeeStream = fs.createWriteStream(writePath);
        for (let i = 0; i < arrHtml.length; i++) {
            let findeComp = arrHtml[i].slice(arrHtml[i].indexOf('{{'), arrHtml[i].indexOf('}}') + 2);
            if (componentText.includes(findeComp)) {
                findeComp = await readFile(path.join(__dirname, 'components', findeComp.slice(2, findeComp.length - 2) + '.html'), 'utf-8');
                writeeStream.write(findeComp + '\r\n');
            } else {
                writeeStream.write(arrHtml[i] + '\r\n');
            }
        }
        writeeStream.end();
    });
}

const start = async () => {
    await founfFiles();
    await copyAll('assets');
    copyStyles();
    copyHtml();
}

start();

