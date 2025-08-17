/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("text3084108217")

  // remove field
  collection.fields.removeById("text4086395088")

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3084108217",
    "max": 0,
    "min": 0,
    "name": "question_language",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(22, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4086395088",
    "max": 0,
    "min": 0,
    "name": "answer_language",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
})
