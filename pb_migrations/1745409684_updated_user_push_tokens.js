/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // remove field
  collection.fields.removeById("date846843460")

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "autodate846843460",
    "name": "last_seen",
    "onCreate": true,
    "onUpdate": true,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "date846843460",
    "max": "",
    "min": "",
    "name": "last_seen",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "date"
  }))

  // remove field
  collection.fields.removeById("autodate846843460")

  return app.save(collection)
})
