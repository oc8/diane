/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id || user = NULL",
    "deleteRule": "user = @request.auth.id || user = NULL",
    "listRule": "user = @request.auth.id || public = true || user = NULL",
    "updateRule": "user = @request.auth.id || user = NULL",
    "viewRule": "user = @request.auth.id || public = true || user = NULL"
  }, collection)

  // remove field
  collection.fields.removeById("bool2897713717")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update collection data
  unmarshal({
    "createRule": "user = @request.auth.id || guest = true",
    "deleteRule": "user = @request.auth.id || guest = true",
    "listRule": "user = @request.auth.id || public = true || guest = true",
    "updateRule": "user = @request.auth.id || guest = true",
    "viewRule": "user = @request.auth.id || public = true || guest = true"
  }, collection)

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "bool2897713717",
    "name": "guest",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
