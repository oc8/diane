/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
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
      "english",
      "science",
      "history",
      "philosophy",
      "psychology",
      "digital",
      "exam"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
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
      "english",
      "science",
      "history",
      "philosophy",
      "psychology",
      "digital"
    ]
  }))

  return app.save(collection)
})
