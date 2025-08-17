/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(17, new Field({
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

  // remove field
  collection.fields.removeById("select2698072953")

  return app.save(collection)
})
