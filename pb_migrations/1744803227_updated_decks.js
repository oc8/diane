/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(16, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2834700227",
    "max": 50000,
    "min": 0,
    "name": "transcript",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // update field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3458754147",
    "max": 10000,
    "min": 0,
    "name": "summary",
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

  // remove field
  collection.fields.removeById("text2834700227")

  // update field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3458754147",
    "max": 0,
    "min": 0,
    "name": "summary",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
