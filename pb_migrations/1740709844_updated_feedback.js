/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // update collection data
  unmarshal({
    "listRule": "id = @request.auth.id",
    "viewRule": "id = @request.auth.id"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // update collection data
  unmarshal({
    "listRule": null,
    "viewRule": null
  }, collection)

  return app.save(collection)
})
