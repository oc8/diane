/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("text2834700227")

  // add field
  collection.fields.addAt(17, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor2834700227",
    "maxSize": 0,
    "name": "transcript",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(14, new Field({
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

  // remove field
  collection.fields.removeById("editor2834700227")

  return app.save(collection)
})
