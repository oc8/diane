/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("number570552902")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(8, new Field({
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

  return app.save(collection)
})
