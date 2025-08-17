/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  status,\n  user,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_qkV5")

  // remove field
  collection.fields.removeById("_clone_a10c")

  // remove field
  collection.fields.removeById("_clone_Dry7")

  // remove field
  collection.fields.removeById("_clone_dTuz")

  // remove field
  collection.fields.removeById("_clone_D2wu")

  // remove field
  collection.fields.removeById("_clone_JcDI")

  // remove field
  collection.fields.removeById("_clone_i25r")

  // remove field
  collection.fields.removeById("_clone_S7j6")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_RLct",
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
    "id": "_clone_pLn8",
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
    "id": "_clone_wDU7",
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
    "id": "_clone_jime",
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
    "id": "_clone_xEWN",
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
    "id": "_clone_7hKF",
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
    "id": "_clone_YBnK",
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
    "id": "_clone_XIm4",
    "maxSelect": 1,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending"
    ]
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_pUl9",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  user,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_qkV5",
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
    "id": "_clone_a10c",
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
    "id": "_clone_Dry7",
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
    "id": "_clone_dTuz",
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
    "id": "_clone_D2wu",
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
    "id": "_clone_JcDI",
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
    "id": "_clone_i25r",
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
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_S7j6",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_RLct")

  // remove field
  collection.fields.removeById("_clone_pLn8")

  // remove field
  collection.fields.removeById("_clone_wDU7")

  // remove field
  collection.fields.removeById("_clone_jime")

  // remove field
  collection.fields.removeById("_clone_xEWN")

  // remove field
  collection.fields.removeById("_clone_7hKF")

  // remove field
  collection.fields.removeById("_clone_YBnK")

  // remove field
  collection.fields.removeById("_clone_XIm4")

  // remove field
  collection.fields.removeById("_clone_pUl9")

  return app.save(collection)
})
