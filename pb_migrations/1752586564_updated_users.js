/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
  collection.fields.addAt(31, new Field({
    "autogeneratePattern": "",
    "hidden": true,
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

  // update field
  collection.fields.addAt(32, new Field({
    "autogeneratePattern": "",
    "hidden": true,
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update field
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

  // update field
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

  return app.save(collection)
})
