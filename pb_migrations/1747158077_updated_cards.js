/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id || user = NULL",
    "deleteRule": "user = @request.auth.id || user = NULL",
    "listRule": "user = @request.auth.id || user = NULL",
    "updateRule": "user = @request.auth.id || user = NULL",
    "viewRule": "user = @request.auth.id || user = NULL"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id",
    "deleteRule": "user = @request.auth.id",
    "listRule": "user = @request.auth.id",
    "updateRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  return app.save(collection)
})
