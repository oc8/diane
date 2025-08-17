/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "listRule": "id = @request.auth.id"
  }, collection)

  // update field
  collection.fields.addAt(28, new Field({
    "autogeneratePattern": "",
    "hidden": true,
    "id": "text443125346",
    "max": 0,
    "min": 0,
    "name": "come_from",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "listRule": "id = @request.auth.id || public = true"
  }, collection)

  // update field
  collection.fields.addAt(28, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text443125346",
    "max": 0,
    "min": 0,
    "name": "come_from",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
