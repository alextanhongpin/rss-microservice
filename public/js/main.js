$(document).ready(() => {

  const primus = new Primus()

  const MainView = $('.main')
  const AsideView = $('.aside')
  const HeaderView = $('.header')
  const SearchView = $('.search')
  const HintView = $('.hint')

  const Store = {
    _data: [],
    init () {
      const local = window.localStorage.rss
      const placeholder = [Math.random() < 0.5 ? 'http://www.thestar.com.my/rss/business/business-news/': 'http://www.thestar.com.my/rss/business/investing/']
      this._data = local ? JSON.parse(local) : placeholder
    },
    load () {
      return this._data
    },
    save (data) {
      let cached = this.load()
      cached.push(data)
      this._data = unique(cached)
      window.localStorage.rss = JSON.stringify(this._data)
    },
    clear () {
      this._data = []
      window.localStorage.rss = JSON.stringify(this._data)
    }
  }
  // Init the store
  Store.init()


  // MainView events
  MainView.on('empty', () => {
    MainView.html('')
  })

  // HintView events
  HintView.on('hideHint', () => {
    HintView.html('')
  })
  HintView.on('showHint', (event, hint) => {
    HintView.html(hint)
  })

  SearchView.on('search', (event, keyword) => {
    SearchView.find('.search-input').val(keyword)
    MainView.trigger('empty')
    subscribe()
  })

  Rx.Observable.fromEvent(SearchView.find('.search-input'), 'keyup')
  .pluck('target', 'value')
  .filter(text => text.length > 2)
  .debounceTime(500)
  .distinctUntilChanged()
  .subscribe(
    data => {
      MainView.trigger('empty')
      subscribe()
    },
    error => {
      HintView.trigger('showHint', [error])
    }
  )
  // AsideView events
  AsideView.find('.js-hide-sidebar').on('click', (evt) => {
    AsideView.hide()
  })
  AsideView.on('populate', (event, data) => {
    const template = data.map((item) => {
      return `<div class='aside-body__list'>${item}</div>`
    }).join('')
    AsideView.find('.aside-body').html(template)
    AsideView.trigger('bindList')
  })

  AsideView.on('bindList', (event) => {
    const $list = AsideView.find('.aside-body__list')
    $list.on('click', (evt) => {
      SearchView.trigger('search', [evt.currentTarget.innerHTML.trim()])

      // Hide upon selecting a list
      AsideView.hide()
    })
  })

  AsideView.trigger('populate', [Store.load()])
  // HeaderView events
  HeaderView.find('.js-show-sidebar').on('click', (evt) => {
    AsideView.show()
  })

  primus.on('data', (data) => {
    const action = data.action
    switch (action) {
      case 'connected': SearchView.trigger('search', [Store.load()[0]])
      break
      case 'client:publish': render(data)
      break
      default: return
    }
  })

  function subscribe (data) {
    primus.write({
      action: 'server:subscribe', 
      payload: { urls: [SearchView.find('.search-input').val().trim()] }
    })
  }

  function render (data) {
    const rss = data.payload
    const error = data.error
    const hasField = SearchView.find('.search-input').val().trim().length
    if (error && hasField) {
      HintView.trigger('showHint', ['Unable to fetch RSS for the provided URI'])
      return false
    } else if (error && !hasField) {
      HintView.trigger('hideHint')
      return false
    }
    HintView.trigger('hideHint')
    if (rss) {
      const title = rss.title
      const summary = rss.summary
      const image = rss.image && rss.image.url
      const link = rss.link
      const pubdate = rss.pubdate
      const style = image ? `background: url(${image}) no-repeat center center; background-size: cover;` : '#C2C2C2'
      // Push the data to the array

      // Sort the data

      // Push the item in the correct order
      MainView.append(`
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
      `)

      // Update the history
      Store.save(SearchView.find('.search-input').val().trim())

      // Populate the view
      AsideView.trigger('populate', [Store.load()])

    } else {
      // No feeds available
      MainView.html('<div>No RSS available</div>')
    }
  }

  // Set Helpers
  function unique (items=[]) {
    const set = new Set(items)
    return setToArray(set)
  }
  function setToArray (set) {
    let arr = []
    set.forEach(v => arr.push(v))
    return arr
  }
  function exclude (items, item) {
    const set = new Set(items)
    set.delete(item)
    return setToArray(set)
  }
  function trimURL (url) {
    if (!url) return null
    return url.replace('http://', '').split('/')[0]
  }
})