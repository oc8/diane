/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(23, new Field({
    "hidden": false,
    "id": "bool2674685588",
    "name": "review_today",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
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
})
