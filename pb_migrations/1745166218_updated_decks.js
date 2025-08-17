/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("json4274335913")

  // add field
  collection.fields.addAt(17, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor4274335913",
    "maxSize": 5,
    "name": "content",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "json4274335913",
    "maxSize": 0,
    "name": "content",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("editor4274335913")

  return app.save(collection)
})
