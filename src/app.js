import { getCoffeeHouses } from './lib/api'

class CoffeeHouse {
  constructor (name, address, location, consumption) {
    this.name = name
    this.address = address
    this.location = location
    this.consumption = consumption
    this.status = 'hiden'
  }

  // 显示标记点
  show (map) {
    if (this.status === 'visible') {
      return
    }
    this.status = 'visible'
    if (this.marker) {
      this.marker.show()
    } else {
      this.marker = new AMap.Marker({
        position: [this.location.longitude, this.location.latitude],
        title: this.name,
        icon: './images/coffee.png'
      })
      this.marker.setMap(map)
      this.marker.on('click',  (e) => {
        this.infoWindow.open(map, e.target.getPosition())
      })
    }
  }

  // 隐藏标记点
  hide () {
    if (this.status === 'hiden') {
      return
    }
    this.status = 'hiden'
    this.marker.hide()
  }

  get infoWindow () {
    const content = `<div class="infowindow-content">
      <div class="amap-info-header">${this.name}</div>
      <div class="amap-info-body">${this.address}<br/>最低消费:${this.consumption}</div>
    </div>`
    return new AMap.InfoWindow({
      content: content,
      offset: new AMap.Pixel(16, -50)
    })
  }
}

class ViewModel {
  constructor () {
    this.consumptionLimit = ko.observable(0)
    this.houses = ko.observableArray()

    this.filteredHouses = ko.computed(() => {
      return this.houses().filter((house) => {
        return house.consumption >= this.consumptionLimit()
      })
    })
    this.unFilteredHouses = ko.computed(() => {
      return this.houses().filter((house) => {
        return house.consumption < this.consumptionLimit()
      })
    })

    this.renderCount = 0
    this.consumptionLimit.subscribe(() => {
      //当过滤数据发生变动时，延迟一秒重新绘制地图上的标记点
      //多次变动，以最后一次变动值进行绘制
      this.renderCount++
      setTimeout(() => {
        this.renderCount--
        if (this.renderCount === 0) {
          this.renderMarker()
        }
      }, 1000)
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
    }
  }

  renderMarker () {
    this.filteredHouses().forEach((house) => {
      house.show(this.map)
    })
    this.unFilteredHouses().forEach((house) => {
      house.hide()
    })
  }

  loadData () {
    const self = this
    //TODO: Loading 窗口
    return getCoffeeHouses().then(function (houses) {
      houses.forEach(function (house) {
        self.houses.push(new CoffeeHouse(house.get('name'), house.get('address'), house.get('location'), house.get('consumption')))
      })
    }, function (err) {
      //TODO: 错误提醒弹窗
      console.log('数据加载异常')
    })
  }
}

const viewModel = new ViewModel()

// 加载数据完成之后，绑定模型
viewModel.loadData().then(function () {
  viewModel.dataStatus('ready')
  ko.applyBindings(viewModel)
}, function (err) {
})

window.mapReady = function mapReady (map) {
  viewModel.mapStatus('ready')
  viewModel.map = map
}
