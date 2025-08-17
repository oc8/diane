/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // remove field
  collection.fields.removeById("select2363381545")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_823787363",
    "hidden": false,
    "id": "relation370448595",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "card",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2363381545",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "card",
      "deck",
      "bug"
    ]
  }))

  // remove field
  collection.fields.removeById("relation370448595")

  return app.save(collection)
})
