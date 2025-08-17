/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // add field
  collection.fields.addAt(31, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2476065779",
    "max": 0,
    "min": 0,
    "name": "customer_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(32, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2585298908",
    "max": 0,
    "min": 0,
    "name": "subscription_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(33, new Field({
    "hidden": false,
    "id": "select3002498459",
    "maxSelect": 1,
    "name": "subscription_status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "incomplete",
      "incomplete_expired",
      "trialing",
      "active",
      "past_due",
      "canceled",
      "unpaid",
      "paused"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // remove field
  collection.fields.removeById("text2476065779")

  // remove field
  collection.fields.removeById("text2585298908")

  // remove field
  collection.fields.removeById("select3002498459")

  return app.save(collection)
})
