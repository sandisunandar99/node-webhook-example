
require('dotenv').config()
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

app.use(Express.json())
app.use(bodyParser.urlencoded({ extended: true }))


/**
 * endpoint for get data webhook from server
*/
app.post('/post', (req, res) => {
    console.log(req.headers);
    console.log(req.body);
    
    //send response status for webhook API call 
    res.send('Success saved name : khi hadi')
})

app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
})

const port = process.env.PORT || 3034
app.listen(port, console.log(`server running on port ${port}`))