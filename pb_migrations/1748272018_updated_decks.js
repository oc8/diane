/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "json714356641",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // update field
  collection.fields.addAt(22, new Field({
    "hidden": false,
    "id": "json714356641",
    "maxSize": 0,
    "name": "urls",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
})
