/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  action,\n  status,\n  user,\n  image,\n  medias,\n  created,\n  new_question,\n  new_answer,\n  (SELECT question_lang FROM decks WHERE id = deck) as question_lang,\n  (SELECT answer_lang FROM decks WHERE id = deck) as answer_lang,\n  (SELECT reverse FROM decks WHERE id = deck) as reverse,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_1UPE")

  // remove field
  collection.fields.removeById("_clone_xs6r")

  // remove field
  collection.fields.removeById("_clone_WQEc")

  // remove field
  collection.fields.removeById("_clone_yjiX")

  // remove field
  collection.fields.removeById("_clone_SH7g")

  // remove field
  collection.fields.removeById("_clone_l3M4")

  // remove field
  collection.fields.removeById("_clone_9Zim")

  // remove field
  collection.fields.removeById("_clone_xjEn")

  // remove field
  collection.fields.removeById("_clone_fw7o")

  // remove field
  collection.fields.removeById("_clone_5sSh")

  // remove field
  collection.fields.removeById("_clone_nDqy")

  // remove field
  collection.fields.removeById("_clone_Stnz")

  // remove field
  collection.fields.removeById("_clone_IMo9")

  // remove field
  collection.fields.removeById("_clone_uk1M")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_F9O1",
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
    "id": "_clone_jj3X",
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
    "id": "_clone_HUV9",
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
    "id": "_clone_UOtc",
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
    "id": "_clone_THqM",
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
    "id": "_clone_26hJ",
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
    "id": "_clone_meWi",
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

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_lZ8W",
    "maxSelect": 1,
    "name": "action",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "add",
      "update",
      "remove"
    ]
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_mkdH",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "freeze"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_70JM",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_V6XO",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_d1D7",
    "max": 0,
    "min": 0,
    "name": "medias",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_QQtf",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_bIqb",
    "max": 0,
    "min": 0,
    "name": "new_question",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_1oJZ",
    "max": 0,
    "min": 0,
    "name": "new_answer",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  action,\n  status,\n  user,\n  image,\n  created,\n  new_question,\n  new_answer,\n  (SELECT question_lang FROM decks WHERE id = deck) as question_lang,\n  (SELECT answer_lang FROM decks WHERE id = deck) as answer_lang,\n  (SELECT reverse FROM decks WHERE id = deck) as reverse,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_1UPE",
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
    "id": "_clone_xs6r",
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
    "id": "_clone_WQEc",
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
    "id": "_clone_yjiX",
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
    "id": "_clone_SH7g",
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
    "id": "_clone_l3M4",
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
    "id": "_clone_9Zim",
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

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "_clone_xjEn",
    "maxSelect": 1,
    "name": "action",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "add",
      "update",
      "remove"
    ]
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_fw7o",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "freeze"
    ]
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_5sSh",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_nDqy",
    "maxSelect": 1,
    "maxSize": 0,
    "mimeTypes": [],
    "name": "image",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_Stnz",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_IMo9",
    "max": 0,
    "min": 0,
    "name": "new_question",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_uk1M",
    "max": 0,
    "min": 0,
    "name": "new_answer",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("_clone_F9O1")

  // remove field
  collection.fields.removeById("_clone_jj3X")

  // remove field
  collection.fields.removeById("_clone_HUV9")

  // remove field
  collection.fields.removeById("_clone_UOtc")

  // remove field
  collection.fields.removeById("_clone_THqM")

  // remove field
  collection.fields.removeById("_clone_26hJ")

  // remove field
  collection.fields.removeById("_clone_meWi")

  // remove field
  collection.fields.removeById("_clone_lZ8W")

  // remove field
  collection.fields.removeById("_clone_mkdH")

  // remove field
  collection.fields.removeById("_clone_70JM")

  // remove field
  collection.fields.removeById("_clone_V6XO")

  // remove field
  collection.fields.removeById("_clone_d1D7")

  // remove field
  collection.fields.removeById("_clone_QQtf")

  // remove field
  collection.fields.removeById("_clone_bIqb")

  // remove field
  collection.fields.removeById("_clone_1oJZ")

  return app.save(collection)
})
