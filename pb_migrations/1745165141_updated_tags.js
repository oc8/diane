/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1219621782")

  // remove field
  collection.fields.removeById("number570552902")

  // add field
  collection.fields.addAt(5, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "relation2751252018",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "decks",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1219621782")

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number570552902",
    "max": null,
    "min": null,
    "name": "progress",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // remove field
  collection.fields.removeById("relation2751252018")

  return app.save(collection)
})
