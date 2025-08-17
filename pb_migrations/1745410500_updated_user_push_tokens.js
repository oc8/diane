/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // remove field
  collection.fields.removeById("text961728715")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select961728715",
    "maxSelect": 1,
    "name": "platform",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "android",
      "ios"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text961728715",
    "max": 0,
    "min": 0,
    "name": "platform",
    "pattern": "^(android|ios)$",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("select961728715")

  return app.save(collection)
})
