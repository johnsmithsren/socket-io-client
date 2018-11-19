const io = require('socket.io-client');
// var chat = require('socket.io')('4000');
const chat = io('http://13.209.42.70:4000')
const readline = require('readline');
const mongoose = require('mongoose');
var ObjectID = require("bson-objectid");
// const objectid = require('objectid')
const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    poolSize: 5, // 连接池中维护的连接数
    reconnectTries: Number.MAX_VALUE,
    keepAlive: 120,
}
const mongoClient = mongoose.createConnection('mongodb://socket:qwe123123@13.209.42.70:27017/socket', options);
const Schema = mongoose.Schema;
const Socket = new Schema({
    name: { type: String, default: 'hahaha' },
    age: { type: Number, min: 18, index: true },
    comments: { type: Array, default: [] },
});
var BlogPost = mongoClient.model('Socket', Socket);
const getList = async () => {
    let list = []
    let cursor = BlogPost.find({}).cursor()
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        // Prints "Val" followed by "Varun"
        list.push(doc);
    }
    return list
}
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var ObjectID = require("bson-objectid");
let id = ObjectID();
var post = new BlogPost({ 'name': id });
chat.emit('login', { 'id': id });
rl.setPrompt(id + '> ');
rl.prompt();
rl.on('line', async function (line) {
    if (line === 'exit') {
        chat.emit('broadcast', { 'id': id, 'value': line })
        process.exit(0)
    } else {
        post.comments.push(line);
        await post.save();
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