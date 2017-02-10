# koa-rss

This is a simple RSS feed reader with koa.js and Primus.


You have to include the primus code on the client side to use this feature.

The api is hosted [here]( https://rss-service.herokuapp.com/)

To connect to the RSS, just add the websocket connection:
```
const primus = new Primus('ws://rss-service.herokuapp.com/')
```

To publish to the websocket event:
```javascript
    primus.write({
        action: 'server:get_all', 
        payload: {
            // Array of rss links
            urls: ['']
        }
    })
```

Subscribe to the websocket event to get the latest feeds:
```
primus.on('data', (data) => {
    if (data.action === 'client:get_all') {
        if (data.payload && data.payload.feeds) {
            const div = document.createElement('li')
            const rss = data.payload.feeds
            const title = rss.title
            const summary = rss.summary
            const image = rss.image.url
            const origLink = rss.meta.origLink
            const pubDate = rss.meta.pubDate
        }
    }
})
```

TODO:
+ Update UI
+ LocalStorage to store favorited RSS links
+ Update Primus code
+ Add schema for request/response
+ Add api documentation
+ Add working example at heroku
