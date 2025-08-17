/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  // remove field
  collection.fields.removeById("_clone_Kyct")

  // remove field
  collection.fields.removeById("_clone_QseU")

  // remove field
  collection.fields.removeById("_clone_7euQ")

  // remove field
  collection.fields.removeById("_clone_rOld")

  // remove field
  collection.fields.removeById("_clone_nBeO")

  // remove field
  collection.fields.removeById("_clone_fXK5")

  // remove field
  collection.fields.removeById("_clone_rRMY")

  // remove field
  collection.fields.removeById("_clone_AXV1")

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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id",
    "viewRule": "user = @request.auth.id"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_Kyct",
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
    "id": "_clone_QseU",
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
    "id": "_clone_7euQ",
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
    "id": "_clone_rOld",
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
    "id": "_clone_nBeO",
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
    "id": "_clone_fXK5",
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
    "id": "_clone_rRMY",
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
    "id": "_clone_AXV1",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

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

  return app.save(collection)
})
