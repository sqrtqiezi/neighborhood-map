import AV from 'leancloud-storage'
import data from './lib/data'

var APP_ID = 'uJV7RqGIOHpI9yd9eCdLMpq8-9Nh9j0Va'
var APP_KEY = 'FHXTjXkwtsJwvi7ydGjAeHeH'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

// 声明一个 CaffeeHouse 类型
var CoffeeHouse = AV.Object.extend('CoffeeHouse')
console.log(data.length)

function getConsumption() {
  return Math.floor(Math.random() * 25 + 5) * 10
}

data.forEach(function (item, index) {
  setTimeout((function (item) {
    return function () {
      // 新建一个 Todo 对象
      var house = new CoffeeHouse()
      house.set('name', item.cname)
      house.set('address', item.cadd)
      house.set('logo', item.logo)
      house.set('consumption', getConsumption())

      var location = new AV.GeoPoint(Number(item.position_y), Number(item.position_x))
      house.set('location', location)

      house.save().then(function (house) {
        // 成功保存之后，执行其他逻辑.
        console.log('New object created with objectId: ' + house.id)
      }, function (error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message)
      })
    }
  })(item), index * 1000)
})