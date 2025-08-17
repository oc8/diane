/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // remove field
  collection.fields.removeById("json666529867")

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4053714274",
    "max": 0,
    "min": 0,
    "name": "new_question",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text575107599",
    "max": 0,
    "min": 0,
    "name": "new_answer",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "json666529867",
    "maxSize": 0,
    "name": "history",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // remove field
  collection.fields.removeById("text4053714274")

  // remove field
  collection.fields.removeById("text575107599")

  return app.save(collection)
})
