/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type, \n  datetime(IFNULL(last_review, date('now')), '+' || (COALESCE(step, 0) * 2) || ' days') AS next_review_date\nFROM cards;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_N1nr")

  // remove field
  collection.fields.removeById("_clone_aTgq")

  // remove field
  collection.fields.removeById("_clone_Zzrl")

  // remove field
  collection.fields.removeById("_clone_ab6j")

  // remove field
  collection.fields.removeById("_clone_bBSJ")

  // remove field
  collection.fields.removeById("_clone_6Jfg")

  // remove field
  collection.fields.removeById("_clone_wb1h")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_ghP6",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "deck",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_VQNA",
    "max": 0,
    "min": 0,
    "name": "question",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_XQnY",
    "max": 0,
    "min": 0,
    "name": "answer",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_RJeU",
    "maxSize": 0,
    "name": "choices",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_nnIY",
    "max": "",
    "min": "",
    "name": "last_review",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_B3ky",
    "max": null,
    "min": null,
    "name": "step",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_hBHj",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "quiz"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type, \n  datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days') AS next_review_date\nFROM cards;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_N1nr",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "deck",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_aTgq",
    "max": 0,
    "min": 0,
    "name": "question",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Zzrl",
    "max": 0,
    "min": 0,
    "name": "answer",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "_clone_ab6j",
    "maxSize": 0,
    "name": "choices",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "_clone_bBSJ",
    "max": "",
    "min": "",
    "name": "last_review",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_6Jfg",
    "max": null,
    "min": null,
    "name": "step",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_wb1h",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "quiz"
    ]
  }))

  // remove field
  collection.fields.removeById("_clone_ghP6")

  // remove field
  collection.fields.removeById("_clone_VQNA")

  // remove field
  collection.fields.removeById("_clone_XQnY")

  // remove field
  collection.fields.removeById("_clone_RJeU")

  // remove field
  collection.fields.removeById("_clone_nnIY")

  // remove field
  collection.fields.removeById("_clone_B3ky")

  // remove field
  collection.fields.removeById("_clone_hBHj")

  return app.save(collection)
})
