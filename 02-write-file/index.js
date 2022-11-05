const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const { stdin: input, stdout: output, exit, on } = require('process');

const message = 'Hello, write your message:';
const exitMessage = 'Goodbye.';
const confirmExitMessage = 'Maybe new message or exit?'
const filePath = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({ input, output });
fs.writeFile(filePath, '', () => {
    console.log(message);
})

rl.on('line', data => {
    if (data == 'exit') {
        console.log(exitMessage);
        process.exit();
    }
    fs.appendFile(filePath, `${data}\n`, () => { console.log(confirmExitMessage); });
});

process.on('beforeExit', () => console.log(exitMessage));



