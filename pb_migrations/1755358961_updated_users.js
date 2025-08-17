/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text3531474156")

  // add field
  collection.fields.addAt(36, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2170006031",
    "max": 0,
    "min": 0,
    "name": "profile",
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

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": true,
    "id": "text3531474156",
    "max": 0,
    "min": 0,
    "name": "ready_to_pay",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("text2170006031")

  return app.save(collection)
})
