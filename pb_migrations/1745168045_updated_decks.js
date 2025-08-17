/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "select2698072953",
    "maxSelect": 5,
    "name": "languages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "fr",
      "en",
      "de",
      "it",
      "es"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "select2698072953",
    "maxSelect": 5,
    "name": "language",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "fr",
      "en",
      "de",
      "it",
      "es"
    ]
  }))

  return app.save(collection)
})
