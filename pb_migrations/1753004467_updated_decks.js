/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1755402631")

  // remove field
  collection.fields.removeById("bool967663800")

  // remove field
  collection.fields.removeById("bool3637660547")

  // add field
  collection.fields.addAt(20, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1877436813",
    "max": 0,
    "min": 0,
    "name": "question_lang",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(21, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1864525730",
    "max": 0,
    "min": 0,
    "name": "answer_lang",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
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

  // remove field
  collection.fields.removeById("text1877436813")

  // remove field
  collection.fields.removeById("text1864525730")

  return app.save(collection)
})
