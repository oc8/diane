/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id",
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // update collection data
  unmarshal({
    "createRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
})
