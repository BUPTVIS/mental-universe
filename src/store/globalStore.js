/**
 * 全局缓存
 */
 class Store {
  constructor() {
    this._map = new Map()
  }

  set (key, value) {
    return this._map.set(key, value)
  }

  get (key) {
    return this._map.get(key)
  }

  delete (key) {
    return this._map.delete(key)
  }

  has (key) {
    return this._map.has(key)
  }

  clear (key) {
    this._map.clear(key)
  }
}

const store = new Store()

export default store
