/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // remove field
  collection.fields.removeById("json666529867")

  return app.save(collection)
})
