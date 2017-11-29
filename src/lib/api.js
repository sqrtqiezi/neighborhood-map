import AV from 'leancloud-storage'

var APP_ID = 'uJV7RqGIOHpI9yd9eCdLMpq8-9Nh9j0Va'
var APP_KEY = 'FHXTjXkwtsJwvi7ydGjAeHeH'

AV.init({
  appId: APP_ID,
  appKey: APP_KEY
})

const DATA_LIMIT = 200

function getCoffeeHouses () {
  const query = new AV.Query('CoffeeHouse')
  return query.limit(DATA_LIMIT).find()
}

export {
  getCoffeeHouses
}