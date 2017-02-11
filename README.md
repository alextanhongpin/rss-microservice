# RSS Insight

RSS Feed built with JavaScript.

Server side is powered by `koa`, `primus` and `feedparser`.

Client side is powered by `jQuery`, `moment`, `rx.js`.

View the working example [here](https://rss-service.herokuapp.com/). Designed by alextanhongpin.

Websocket endpoint:

```javascript
const primus = new Primus('ws://rss-service.herokuapp.com/')
```

Request:

```javascript
primus.write({
    action: 'server:publish', 
    payload: {
        // Array of rss links
        urls: ['']
    }
})
```

Response:

```javascript
primus.on('data', (data) => {
    const rss = data.payload
    const error = data.error
    const action = data.action

    if (error) handleError(error)
    if (action === 'client:subscribe') {
        if (rss) {
            const title = rss.title
            const summary = rss.summary
            const image = rss.image.url
            const link = rss.link
            const pubdate = rss.pubdate
        }
    }
})
```
