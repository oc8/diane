/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || public = true || user = NULL",
    "updateRule": "user = @request.auth.id || user = NULL",
    "viewRule": "user = @request.auth.id || public = true || user = NULL"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || public = true || user = NULL || user.email = \"contact@diane.app\"",
    "updateRule": "user = @request.auth.id || user = NULL || user.email = \"contact@diane.app\"",
    "viewRule": "user = @request.auth.id || public = true || user = NULL || user.email = \"contact@diane.app\""
  }, collection)

  return app.save(collection)
})
