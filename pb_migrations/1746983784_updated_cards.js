/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "viewRule": "user = @request.auth.id || user = null"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
})
