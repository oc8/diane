/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457221083")

  // remove field
  collection.fields.removeById("text2324736937")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2457221083")

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2324736937",
    "max": 0,
    "min": 0,
    "name": "key",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
