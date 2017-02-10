
const primus = new Primus()
// const primus = new Primus('ws://mysterious-lowlands-59375.herokuapp.com/')
const main = document.querySelector('main')
const input = registerInput('input[name=rss]')
const hint = document.querySelector('.hint')
const recent = document.querySelector('.recent-searches')
let recentSearches = window.localStorage.recentSearches ? JSON.parse(window.localStorage.recentSearches) : []

primus.on('data', (data) => {
  const action = data.action
  switch (action) {
    case 'connected': subscribe()
    break
    case 'client:publish': onGetAll(data)
    break
    default: return
  }
})

function subscribe (data) {
  primus.write({
    action: 'server:subscribe', 
    payload: { urls: [input.value.trim()] }
  })
}

function onGetAll (data) {
  const hasError = data.error

  if (hasError) {
    hint.innerHTML = 'Unable to fetch RSS from the provided uri.'
    return false
  }
  hint.innerHTML = ''
  const hasRSS = data.payload && data.payload.rss

  if (hasRSS) {
    const rss = data.payload.rss
    const title = rss.title
    const summary = rss.summary
    const image = rss.image.url
    const link = rss.link
    const pubdate = rss.pubdate

    const style = image ? `background: url(${image}) no-repeat center center; background-size: cover;` : '#C2C2C2'

    main.innerHTML += `
    <div>
      <a class='list' href='${link}'>
        <div class='list-column--left'>
          <div class='list-photo' style='${style}'>
          </div>
        </div>
        <div class='list-column--right'>
          <h3 class='title'>${title}</h3>
          <p class='description'>${summary}</p>
          <p class='info'>by <span class='link'>
              ${trimURL(link)}
            </span> &#47; <span class='info'>${moment(pubdate).calendar()}</span>
          </p>
        </div>
      </a>
    </div>
    `
    saveToRecentSearch()

    recent.innerHTML = recentSearches.map((item) => {
      return `<div class='recent-searches__item'>${item}</div>`
    }).join('')

    bindDeleteRecentSearches()

  } else {
    // No feeds available
    main.innerHTML = '<div>No RSS available</div>'
  }
}

function trimURL (url) {
  return url.replace('http://', '').split('/')[0]
}

function saveToRecentSearch () {
  // Push to the recent searches
  recentSearches.push(input.value)
  const set = new Set(recentSearches)
  // Empty the array
  recentSearches = []
  set.forEach(v => recentSearches.push(v))
  window.localStorage.recentSearches = JSON.stringify(recentSearches)
}

function removeFromRecentSearches (key) {
  const set = new Set(recentSearches)
  set.delete(key)
  recentSearches = []
  set.forEach(v => recentSearches.push(v))
  window.localStorage.recentSearches = JSON.stringify(recentSearches)
}

function bindDeleteRecentSearches () {
  const items = document.querySelectorAll('.recent-searches__item')
  items.forEach((item) => {
    item.addEventListener('click', (evt) => {
      const key = evt.currentTarget.innerHTML.trim()
      removeFromRecentSearches(key)

      recent.innerHTML = recentSearches.map((item) => {
        return `<div class='recent-searches__item'>${item}</div>`
      }).join('')
    })
  })
}

function registerInput (name) {
  const input = document.querySelector(name)
  input.addEventListener('input', (evt) => {
    if (!evt.currentTarget.value.trim().length) {
      return false
    }
    main.innerHTML = ''
    subscribe()
  }, false)
  return input
}

