import { getCoffeeHouses } from './lib/api'
import './css/app.scss'

// 地图对象
let aMap

// 最高评分常量
const MAX_STARS = 5

/**
 * @class CoffeeHouse
 * @description 保存 coffeeHouse 的名称、地址、位置等信息
 * 实现 coffeeHouse 的显示、隐藏、弹窗等动作
 */
class CoffeeHouse {
  constructor (name, address, location, cover, stars) {
    this.name = name
    this.address = address
    this.location = [location.longitude, location.latitude]
    this.cover = cover
    this.stars = stars
    this.status = 'hiden'
  }

  get starsDisplay () {
    let result = ['评分： ']
    for(let i=0; i < MAX_STARS; i++) {
      result.push(`<i class="fa ${i < this.stars ? 'fa-star': 'fa-star-o'}" aria-hidden="true"></i>`)
    }
    return result.join('')
  }

  // 显示标记点
  show () {
    if (this.status === 'visible') {
      return
    }
    this.status = 'visible'
    if (this.marker) {
      this.marker.show()
    } else {
      this.marker = new AMap.Marker({
        position: this.location,
        title: this.name,
        icon: './images/coffee.png'
      })
      this.marker.setMap(aMap)
      this.marker.on('click', () => {
        this.openInfo()
      })
    }
  }

  // 隐藏标记点
  hide () {
    if (!this.marker || this.status === 'hiden') {
      return
    }
    this.status = 'hiden'
    this.marker.hide()
  }

  // 详情弹窗
  openInfo () {
    if (!this.infoWindow) {
      const content = `<div class="card" data-bind="click: $parent.displayHouse" src="javascript:;">
        <img class="image" src="${this.cover}-small2">
        <div class="body">
          <div class="header">${this.name}</div>
          <div class="meta">${this.address}</div>
        </div>
        <div class="extra">
          ${this.starsDisplay}
        </div>
      </div>`
      this.infoWindow = new AMap.InfoWindow({
        content: content,
        offset: new AMap.Pixel(10, -30)
      })
    }
    this.infoWindow.open(aMap, this.location)
  }

  // 显示咖啡屋
  display () {
    aMap.setCenter(this.location)
    aMap.setZoom(18)
    this.openInfo()
  }
}

/**
 * @class ViewModel
 * @description Knockout 的 ViewModel
 */
class ViewModel {
  constructor () {
    this.starsLimit = ko.observable(0)
    this.starsList = [5,4,3,2,1,0]
    this.houses = ko.observableArray()
    this.isOpened = ko.observable(true)

    this.CENTER = [121.5718769, 29.8600041]
    this.ZOOM_LEVEL = 13

    this.filteredHouses = ko.pureComputed(() => {
      const value = this.starsLimit()
      const houses = this.houses()

      if (value === 0) {
        return houses
      }
      return this.houses().filter((house) => {
        return house.stars === value
      })
    })

    this.unfilteredHouses = ko.pureComputed(() => {
      const value = this.starsLimit()
      const houses = this.houses()

      if (value === 0) {
        return []
      }
      return this.houses().filter((house) => {
        return house.stars !== value
      })
    })

    this.starsLimit.subscribe((newValue) => {
      // next ticket
      setTimeout(() => this.renderMarker(), 0)
    })

    this.filterDisplay = ko.pureComputed(() => {
      const value = this.starsLimit()
      if(value === 0) {
        return '选择评分'
      }
      return this.displayStars(value)
    })

    this.mapStatus = ko.observable('pending')
    this.dataStatus = ko.observable('pending')
    this.dataStatus.subscribe(this.allReady.bind(this))
    this.mapStatus.subscribe(this.allReady.bind(this))
  }

  /**
   * 地图与数据均加载完成之后，绘制标记点
   */
  allReady () {
    if (this.mapStatus() === 'ready' && this.dataStatus() === 'ready') {
      this.renderMarker()
      $('.loading').hide()
    }
  }

  toggle() {
    this.isOpened(!this.isOpened())
  }

  displayHouse (house) {
    house.display()
  }

  displayStars (stars) {
    if (stars === 0) {
      return '显示全部'
    }
    const result = []
    for(let i=0; i<stars; i++) {
      result.push(`<i class="fa fa-star" aria-hidden="true"></i>`)
    }
    return result.join('')
  }

  applingFilter (stars) {
    this.starsLimit(stars)
  }

  renderMarker () {
    this.filteredHouses().forEach((house) => {
      house.show()
    })

    this.unfilteredHouses().forEach(house => {
      house.hide()
    })
    aMap.setZoomAndCenter(this.ZOOM_LEVEL, this.CENTER)
  }

  // 载入数据
  loadData () {
    const self = this
    return getCoffeeHouses().then(function (houses) {
      houses.forEach(function (house) {
        self.houses.push(
          new CoffeeHouse(house.get('name'),
            house.get('address'),
            house.get('location'),
            house.get('cover'),
            house.get('stars'))
          )
      })
    }, function (err) {
      //TODO: 错误提醒弹窗
      console.log('数据加载异常')
    })
  }

  // 地图加载完成
  mapReady (map) {
    aMap = map
    this.mapStatus('ready')
  }
}

ko.bindingHandlers.sidebarVisible = {
  init: function(element, valueAccessor) {
    const value = valueAccessor();
    $(element).toggleClass('is-opened', ko.unwrap(value))
  },
  update: function(element, valueAccessor) {
    const value = valueAccessor();
    $(element).toggleClass('is-opened', ko.unwrap(value))
  }
}

const viewModel = new ViewModel()

// 加载数据完成之后，绑定模型
viewModel.loadData().then(function () {
  viewModel.dataStatus('ready')
  ko.applyBindings(viewModel)
})

window.viewModel = viewModel
