var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})


//Updated webhook API to look for special messages to trigger the cards and send back a postback function when user clicks on message button or card
app.post('/webhook/', function (req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            
            /*if (text === 'Generic') {
                sendGenericMessage(sender)
                continue
            }*/
            if (text === 'hello')
                {
                    sayText(sender, "Hi there! I am Bob Finder. I am an assistant to help you find and support Black Owned Businesses local to your area! Just type the word location to get started.")
                    continue
                }
            if (text === 'location') {
                askLocation()
                continue
                }
            if (text === 'Raleigh') {
                sayText(sender, "What lovely city!")
                askIndustry()
                continue
            }

            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
        /*else if (event.postback && event.postback.payload) {
            payload = event.postback.payload;
            if (reply === 'Raleigh') {
                sayText(sender, "What lovely city!")
                askIndustry()
                continue
            }
            if (reply === 'Chapel Hill') {
                sayText(sender, "What lovely city!")
                askIndustry()
                continue
            }*/
            
        }
    
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
        
    }
    res.sendStatus(200)
})

var token = "EAAEnfFiEp68BAFZAumeQ1YaJi92AZBhTrhAwrRMw4wtTztD2qj3ONozV7m5h7lJdVFpjTaHq2WMZBZCFIgkLH3qKaClZB9Soi1ZAWYUgr2yfYb6Y2Fx3bO8HKnQvHmMnZCnCQVmYxGEiVNti5cJZCzey9P3lBrG3FapXdanVwaRSrAZDZD"

//function to echo back messages
function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

//doesn't like classes for some reason
//class to define a business - not sure about the no arg versions
/*class Business = class Business {
    constructor(l, n , i){
        this.location = l;
        this.name = n;
        this.industry = i;
    }
}
//unnamed class that takes arguements and creates business object
class Business = class {
    constructor(l, n , i){
        this.location = l;
        this.name = n;
        this.industry = i;
    }
}*/


//function to greet user when they say hello, hi, etc. to give a welcome+command greeting
//if there is an error, it might be here since i typed it myself.
function sayText(sender, text)
{
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
    
}

//function asking for location of business.
function askLocation() {
    messageData = {
        "text":"What is your location?",
        "quick_replies":[{
            "content_type":"text",
            "title":"Raleigh",
            "payload":"Raleigh"
        },
        {
            "content_type":"text",
            "title":"Chapel Hill",
            "payload":"Chapel Hill"
        }]
    }
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function askIndustry() {
    messageData = {
        "text":"What type of business are you looking for?",
        "quick_replies":[{
            "content_type":"text",
            "title":"Hair Salon",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_SALON"
        },
        {
            "content_type":"text",
            "title":"Mechanic",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_MECHANIC"
        },
        {
            "content_type":"text",
            "title":"Restaurant",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RESTAURANT"
        }]
        
    }
      request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
//Send a Test Message Back as Two Cards
function sendGenericMessage(sender) {
    messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "First card",
                    "subtitle": "Element #1 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/rift.png",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://www.messenger.com",
                        "title": "web url"
                    }, {
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for first element in a generic bubble",
                    }],
                }, {
                    "title": "Second card",
                    "subtitle": "Element #2 of an hscroll",
                    "image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
                    "buttons": [{
                        "type": "postback",
                        "title": "Postback",
                        "payload": "Payload for second element in a generic bubble",
                    }],
                }]
            }
        }
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
