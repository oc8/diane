/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT id, deck, question, answer, choices, last_review, step, type FROM CARDS;"
  }, collection)

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json3069659470",
    "maxSize": 1,
    "name": "question",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json3671935525",
    "maxSize": 1,
    "name": "answer",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json97424953",
    "maxSize": 1,
    "name": "choices",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "json4081320732",
    "maxSize": 1,
    "name": "last_review",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "json1136262716",
    "maxSize": 1,
    "name": "step",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "json2363381545",
    "maxSize": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT id, deck FROM CARDS;"
  }, collection)

  // remove field
  collection.fields.removeById("json3069659470")

  // remove field
  collection.fields.removeById("json3671935525")

  // remove field
  collection.fields.removeById("json97424953")

  // remove field
  collection.fields.removeById("json4081320732")

  // remove field
  collection.fields.removeById("json1136262716")

  // remove field
  collection.fields.removeById("json2363381545")

  return app.save(collection)
})
