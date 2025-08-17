/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2834700227",
    "max": 10000000,
    "min": 0,
    "name": "transcript",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2834700227",
    "max": 100000,
    "min": 0,
    "name": "transcript",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
