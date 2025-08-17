/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || public = true",
    "viewRule": "user = @request.auth.id || public = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
})
