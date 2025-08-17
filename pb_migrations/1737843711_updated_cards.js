/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "createRule": "id = @request.auth.id",
    "deleteRule": "id = @request.auth.id",
    "listRule": "id = @request.auth.id",
    "updateRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // update collection data
  unmarshal({
    "createRule": null,
    "deleteRule": null,
    "listRule": null,
    "updateRule": null
  }, collection)

  return app.save(collection)
})
