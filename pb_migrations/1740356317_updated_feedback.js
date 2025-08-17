/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2456230977")

  // remove field
  collection.fields.removeById("relation370448595")

  // add field
  collection.fields.addAt(3, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "relation1336686135",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "deck",
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

  // remove field
  collection.fields.removeById("relation1336686135")

  return app.save(collection)
})
