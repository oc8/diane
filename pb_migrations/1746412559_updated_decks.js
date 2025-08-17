/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "bool967663800",
    "name": "audio_question",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "bool3637660547",
    "name": "audio_answer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(20, new Field({
    "hidden": false,
    "id": "date3074913522",
    "max": "",
    "min": "",
    "name": "deadline",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("bool967663800")

  // remove field
  collection.fields.removeById("bool3637660547")

  // remove field
  collection.fields.removeById("date3074913522")

  return app.save(collection)
})
