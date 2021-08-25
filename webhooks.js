
require('dotenv').config()
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

// test initialize webhook
const WebHooks = require('node-webhooks')
const webhooks = new WebHooks({
    // db: '../webhooks.json',
    db: {"addPost": ["http://localhost:3033/post"]}, 
    httpSuccessCodes: [200, 201, 202, 203, 204],
    DEBUG: true
})

/**
 * agar bisa di baca webhook method yang di gunakan harus post
 */

webhooks.add('shortname1', 'http://127.0.0.1:3034/post').then(function(){
    // done
}).catch(function(err){
    console.log(err)
})

app.post('/post', (req, res) => {
    console.log("success get data");
    webhooks.trigger('shortname1', {data: 123})
    res.send('post data webhook')
})



const emitter =  webhooks.getEmitter()
emitter.on('*.success', function (shortname, statusCode, body) {
    console.log('Success on trigger webHook ' + shortname + ' with status code ', statusCode, ' and body ', body)
})
 
emitter.on('*.failure', function (shortname, statusCode, body) {
    console.error('Error on trigger webHook ' + shortname + ' with status code ', statusCode, ' and body ', body)
})



app.use(Express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/get', (req, res) => {
    res.send('Hello World')
})



app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
})

const port = 3033
app.listen(port, console.log(`server running on port ${port}`))