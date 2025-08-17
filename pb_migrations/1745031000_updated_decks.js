/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("relation1874629670")

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "select59357059",
    "maxSelect": 1,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "technology",
      "language",
      "mathematics",
      "science",
      "history",
      "philosophy",
      "psychology"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(7, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1219621782",
    "hidden": false,
    "id": "relation1874629670",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("select59357059")

  return app.save(collection)
})
