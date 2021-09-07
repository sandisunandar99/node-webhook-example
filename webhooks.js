
require('dotenv').config()
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// test initialize webhook
const WebHooks = require('node-webhooks')
const webhooks = new WebHooks({
    // db: '../webhooks.json',
    db: {"addPost": ["http://localhost:3033/saved"]}, 
    httpSuccessCodes: [200, 201, 202, 203, 204],
    DEBUG: true
})

/**
 * this  URL is used client for get data from server webhook
 * method can read on webhooks using POST
 */

// define URL client1 for webhook
webhooks.add('client1', 'http://127.0.0.1:3034/post/1').then(function(){
    // done
}).catch(function(err){
    console.log(err)
})


// defining URL client2 for webhook
webhooks.add('client2', 'http://127.0.0.1:3034/post/2?key=123456').then(function(){

}).catch(function(err){
    console.log(err)
})

/**
 * strategy 1 :  post data without key and header data  
*/
app.post('/post/1', (req, res) => {
    const sendBody = req.body   

    webhooks.trigger('client1', sendBody)
    res.send('post data webhook 1')
})


/**
 * strategy 2 :  post data with key and header data
*/
app.post('/post/2', (req, res) => {
    const sendBody = req.body

    webhooks.trigger('client2', sendBody)
    res.send('post data webhook 2')
})


/**
 * save data callback from client
*/
app.post('/saved', (req, res) => {
    const saveCallbackResponse = req.body   
    console.log(saveCallbackResponse)
})

/**
 * implemtation API call from client for checking  if data success saved or failed
 * trappingh all response from client
*/
const emitter =  webhooks.getEmitter()
emitter.on('*.success', function (shortname, statusCode, body) {
    console.log('Success on trigger webhooks ' + shortname + ' with status code ', statusCode, ' and body ', body)
})
 
emitter.on('*.failure', function (shortname, statusCode, body) {
    console.error('Error on trigger webhooks ' + shortname + ' with status code ', statusCode, ' and body ', body)
})


app.get('/', (req, res) => {
    res.send('App Webhooks servers')
})


app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
})




const port = 3033
app.listen(port, console.log(`server running on port ${port}`))

/**
 * Scuring webhooks application consist 3 methods
 * 1. Using IP whitelist 
 * 2. Secret key 
 * 3. Signature
 * */

/**
 * Manajemen if error sending webhook 
 * 1. push to queue SQS AWS 
*/