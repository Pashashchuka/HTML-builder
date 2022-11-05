const fs = require('fs');
const path = require('path');

const bundlePath = path.resolve(__dirname + '/project-dist/bundle.css');

fs.writeFile(bundlePath, '', () => { })

fs.readdir('05-merge-styles/styles', { withFileTypes: true }, (_, files) => {
    let arr = [];
    for (let i = 0; i < files.length; i++) {
        const fileName = files[i].name;

        if (files[i].isFile() && path.extname(fileName) == '.css') {
            fs.readFile(`05-merge-styles/styles/${fileName}`, 'utf-8', (_, data) => {
                arr.push(data);
                fs.appendFile(bundlePath, data, () => { })
            });
        }
    }
});

