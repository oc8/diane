/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || user = NULL || @request.auth.email = \"contact@diane.app\"",
    "updateRule": "user = @request.auth.id || user = NULL || @request.auth.email = \"contact@diane.app\"",
    "viewRule": "user = @request.auth.id || user = NULL || @request.auth.email = \"contact@diane.app\""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || user = NULL",
    "updateRule": "user = @request.auth.id || user = NULL",
    "viewRule": "user = @request.auth.id || user = NULL"
  }, collection)

  return app.save(collection)
})
