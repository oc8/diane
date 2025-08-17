/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  status,\n  user,\n  created,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

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

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_Bi7G",
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
    "id": "_clone_xQV9",
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
    "id": "_clone_oBLY",
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
    "id": "_clone_abUH",
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
    "id": "_clone_cvlx",
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
    "id": "_clone_a9ZG",
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
    "id": "_clone_rd6W",
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
    "id": "_clone_e1Ca",
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
    "id": "_clone_f6nJ",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_zutk",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type,\n  status,\n  user,\n  IFNULL(datetime(IFNULL(last_review, 'now'), '+' || (COALESCE(step, 0) * 2) || ' days'), datetime('now')) AS next_review_date\nFROM cards;"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_Bi7G")

  // remove field
  collection.fields.removeById("_clone_xQV9")

  // remove field
  collection.fields.removeById("_clone_oBLY")

  // remove field
  collection.fields.removeById("_clone_abUH")

  // remove field
  collection.fields.removeById("_clone_cvlx")

  // remove field
  collection.fields.removeById("_clone_a9ZG")

  // remove field
  collection.fields.removeById("_clone_rd6W")

  // remove field
  collection.fields.removeById("_clone_e1Ca")

  // remove field
  collection.fields.removeById("_clone_f6nJ")

  // remove field
  collection.fields.removeById("_clone_zutk")

  return app.save(collection)
})
