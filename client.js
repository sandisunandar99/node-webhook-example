
require('dotenv').config()
const Express = require('express')
const bodyParser = require('body-parser')
const app = Express()

app.use(Express.json())
app.use(bodyParser.urlencoded({ extended: true }))


app.get('/get', (req, res) => {
    console.log('getttttttt');
    res.send('Hello GET')
})

app.post('/post', (req, res) => {
    console.log("posttttttttttt");
    res.send('Hello POST')
})

app.use((req, res, next) => {
    res.status(404).send('404 Not Found')
})

const port = process.env.PORT || 3034
app.listen(port, console.log(`server running on port ${port}`))