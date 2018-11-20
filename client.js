const io = require('socket.io-client');
const chat = io('http://127.0.0.1:4000')
const readline = require('readline');
var ObjectID = require("bson-objectid");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var ObjectID = require("bson-objectid");
let id = ObjectID();
chat.emit('login', { 'id': id });
rl.setPrompt(id + '> ');
rl.prompt();
rl.on('line', async function (line) {
    if (line === 'exit') {
        chat.emit('broadcast', { 'id': id, 'value': line })
        process.exit(0)
    } else {
        chat.emit('callback', { 'username': id, 'value': line });
        rl.setPrompt(id + '> ');
        await rl.prompt();
    }
});
chat.on('callback', async function (data) {
    rl.setPrompt(data.id + '> ');
    await rl.prompt();
    console.log(data.value)
    rl.setPrompt(id + '> ');
    await rl.prompt();
});
chat.on('login', async function (data) {
    // user login
    if (data.id != id) {
        rl.setPrompt(data.id + '> ');
        await rl.prompt();
        console.log(data.value)
        await rl.prompt();
        console.log(data.userList.length + '人在线')
        rl.setPrompt(id + '> ');
        await rl.prompt();
    } else {
        await rl.prompt();
        console.log(data.userList.length + '人在线')
        rl.setPrompt(id + '> ');
        await rl.prompt();
    }

});
chat.on('disconnect', function () {
    //断开
    chat.emit('broadcast', { 'id': id, value: 'exit' })
})