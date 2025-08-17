/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(30, new Field({
    "hidden": false,
    "id": "select480291562",
    "maxSelect": 1,
    "name": "display_mode",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "graph"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select480291562")

  return app.save(collection)
})
