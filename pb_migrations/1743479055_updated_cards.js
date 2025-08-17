/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "quiz"
    ]
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json97424953",
    "maxSize": 0,
    "name": "choices",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // remove field
  collection.fields.removeById("select2363381545")

  // remove field
  collection.fields.removeById("json97424953")

  return app.save(collection)
})
