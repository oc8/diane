/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "select59357059",
    "maxSelect": 1,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "exam",
      "language",
      "english",
      "science",
      "history",
      "philosophy",
      "psychology",
      "geography",
      "technology",
      "digital",
      "other"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "select59357059",
    "maxSelect": 1,
    "name": "tag",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "exam",
      "language",
      "english",
      "science",
      "history",
      "philosophy",
      "psychology",
      "geography",
      "technology",
      "digital"
    ]
  }))

  return app.save(collection)
})
