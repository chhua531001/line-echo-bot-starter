let express = require('express')
let bodyParser = require('body-parser')
let request = require('request')
let HashMap = require('hashmap')
let app = express()

var map = new HashMap();

map.set("Hi", "Hi")
.set("你好", "你好")
.set("Hello", "Hello")
.set("晚餐", "牛肉麵")
.set("名字", "花志雄")
.set("信箱", "chhua531001@gmail.com")

map.forEach(function(value, key) {
    console.log(key + " : " + value);
});


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

    let events=req.body.events
    events.forEach((event) => {
        let replyToken = event.replyToken
        let type = event.message.type
        if(type == 'text') {
            var text = event.message.text

            map.forEach(function(value, key) {

                if(text.indexOf(key) != -1) {
                    text = value
                }                
                // console.log(key + " : " + value);
            });

            // if(text.indexOf('名字') != -1) {
            //     // text = '花志雄'
            //     text = map.get("名字")
            // }
            // else if(text.indexOf('信箱') != -1) {
            //     text = "chhua531001@gmail.com"
            // }

            // if(text == '你叫什麼名字') {
            //     text = '花志雄'
            // } 
            // else if (text == '你的信箱') {
            //     text = "chhua531001@gmail.com"
            // }
            sendMessage(replyToken, text)
        } 
        else {
            sendMessage(replyToken, type)
        }
    })

    res.send()
})

// generic function sending messages
function sendMessage(replyToken, text) {
    let body = {
        //replyToken: replyToken
        replyToken,
        messages: [{
            type: 'text',
            //text: text
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
