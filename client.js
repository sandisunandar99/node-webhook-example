
require('dotenv').config()
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

app.use(Express.json())
app.use(bodyParser.urlencoded({ extended: true }))


/**
 * endpoint for get data webhook from server strategy 1
*/
app.post('/post/1', (req, res) => {
    console.log(req.body);
    
    //send response status for webhook API call 
    res.send({message: "success", data : req.body})
})

/**
 * endpoint for get data webhook from server strategy 2
*/
app.post('/post/2', (req, res) => {
    console.log(req.headers);
    let key = req.query.key

    if (key !== 123456) {
        res.send({message: "failed", data : null})   
    }

    //send response status for webhook API call 
    res.send({message: "success", data : req.body})
})

app.get('/', (req, res) => {
    res.send('App Client test Webhooks')
})

app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
})

const port = process.env.PORT || 3034
app.listen(port, console.log(`server running on port ${port}`))