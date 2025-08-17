/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(26, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1024547361",
    "max": 0,
    "min": 0,
    "name": "oauth2_id",
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

  // remove field
  collection.fields.removeById("text1024547361")

  return app.save(collection)
})
