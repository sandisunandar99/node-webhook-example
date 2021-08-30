
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

// url silacak / kemennkes
webhooks.add('client', 'http://127.0.0.1:3034/post').then(function(){
    // done
}).catch(function(err){
    console.log(err)
})


/**
 * simulation triger data for send to client 
*/
app.post('/post', (req, res) => {
    const sendBody = req.body   

    webhooks.trigger('client', sendBody, {Authorization: 'aklsdalsdbaljhkasbdajklhskghj'})
    res.send('post data webhook')
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