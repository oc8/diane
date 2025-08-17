/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(36, new Field({
    "hidden": false,
    "id": "select1793681784",
    "maxSelect": 1,
    "name": "payment_processor",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "stripe",
      "revenuecat"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("select1793681784")

  return app.save(collection)
})
