/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("date3544550585")

  // add field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "bool2674685588",
    "name": "streak_today",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(21, new Field({
    "hidden": false,
    "id": "date3544550585",
    "max": "",
    "min": "",
    "name": "start_streak",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("bool2674685588")

  return app.save(collection)
})
