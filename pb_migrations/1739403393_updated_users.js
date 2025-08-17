/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("number428481321")

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

  // add field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "date4081320732",
    "max": "",
    "min": "",
    "name": "last_review",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "number428481321",
    "max": null,
    "min": null,
    "name": "streak",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("date3544550585")

  // remove field
  collection.fields.removeById("date4081320732")

  return app.save(collection)
})
