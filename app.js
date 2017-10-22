let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let app = express()

const CHANNEL_ACCESS_TOKEN = 'fzGSull4pgOP7HmyZ8IPeapC+JlTWP7fSFeExfgMLqrKZ67khYllJolr1jpNx+QZ+V1jSx3jYKRyokmdK43c4ZJiYYQm34yNlJDm+MJQsxC+cXU7loiBEJiROoktWBXre+99lIcQMCBc8bObFAJhiwdB04t89/1O/w1cDnyilFU='
const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.listen(PORT, function () {
    console.log(`App listening on port ${PORT}!`)
})

// handler receiving messages
app.post('/', function (req, res) {
    console.log(JSON.stringify(req.body, null,2))
    res.send()
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        replyToken,
        messages: [{
            type: 'text',
            text,
        }],
    };

    let options = {
        url: 'https://api.line.me/v2/bot/message/reply',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`,
        },
        body,
        json: true,
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}
