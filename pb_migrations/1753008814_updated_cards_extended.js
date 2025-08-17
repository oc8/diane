/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  action,\n  status,\n  user,\n  image,\n  created,\n  new_question,\n  new_answer,\n  (SELECT question_lang FROM decks WHERE id = deck) as question_lang,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_R5uj")

  // remove field
  collection.fields.removeById("_clone_nwnZ")

  // remove field
  collection.fields.removeById("_clone_5kjC")

  // remove field
  collection.fields.removeById("_clone_zgEG")

  // remove field
  collection.fields.removeById("_clone_NA8Z")

  // remove field
  collection.fields.removeById("_clone_wMp4")

  // remove field
  collection.fields.removeById("_clone_umBQ")

  // remove field
  collection.fields.removeById("_clone_PY24")

  // remove field
  collection.fields.removeById("_clone_ZaTW")

  // remove field
  collection.fields.removeById("_clone_fO4s")

  // remove field
  collection.fields.removeById("_clone_cdtu")

  // remove field
  collection.fields.removeById("_clone_1AOl")

  // remove field
  collection.fields.removeById("_clone_7DTC")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_yDnw",
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
    "id": "_clone_Jqa0",
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
    "id": "_clone_YdPk",
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
    "id": "_clone_Nsxp",
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
    "id": "_clone_Dbtz",
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
    "id": "_clone_LItT",
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
    "id": "_clone_wV0o",
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
    "id": "_clone_HzKy",
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
    "id": "_clone_ktst",
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
    "id": "_clone_XYK4",
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
    "id": "_clone_kp3p",
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
    "id": "_clone_63k2",
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
    "id": "_clone_WCaS",
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
    "id": "_clone_subO",
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

  // add field
  collection.fields.addAt(15, new Field({
    "hidden": false,
    "id": "json1877436813",
    "maxSize": 1,
    "name": "question_lang",
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
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  action,\n  status,\n  user,\n  created,\n  new_question,\n  new_answer,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_R5uj",
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
    "id": "_clone_nwnZ",
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
    "id": "_clone_5kjC",
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
    "id": "_clone_zgEG",
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
    "id": "_clone_NA8Z",
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
    "id": "_clone_wMp4",
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
    "id": "_clone_umBQ",
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
    "id": "_clone_PY24",
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
    "id": "_clone_ZaTW",
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
    "id": "_clone_fO4s",
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
    "id": "_clone_cdtu",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_1AOl",
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
  collection.fields.addAt(13, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_7DTC",
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
  collection.fields.removeById("_clone_yDnw")

  // remove field
  collection.fields.removeById("_clone_Jqa0")

  // remove field
  collection.fields.removeById("_clone_YdPk")

  // remove field
  collection.fields.removeById("_clone_Nsxp")

  // remove field
  collection.fields.removeById("_clone_Dbtz")

  // remove field
  collection.fields.removeById("_clone_LItT")

  // remove field
  collection.fields.removeById("_clone_wV0o")

  // remove field
  collection.fields.removeById("_clone_HzKy")

  // remove field
  collection.fields.removeById("_clone_ktst")

  // remove field
  collection.fields.removeById("_clone_XYK4")

  // remove field
  collection.fields.removeById("_clone_kp3p")

  // remove field
  collection.fields.removeById("_clone_63k2")

  // remove field
  collection.fields.removeById("_clone_WCaS")

  // remove field
  collection.fields.removeById("_clone_subO")

  // remove field
  collection.fields.removeById("json1877436813")

  return app.save(collection)
})
