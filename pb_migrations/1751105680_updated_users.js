/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(27, new Field({
    "autogeneratePattern": "",
    "hidden": true,
    "id": "text2011779337",
    "max": 0,
    "min": 0,
    "name": "google_access_token",
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

  // update field
  collection.fields.addAt(27, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2011779337",
    "max": 0,
    "min": 0,
    "name": "google_access_token",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
