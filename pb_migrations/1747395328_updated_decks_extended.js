/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "listRule": "user = @request.auth.id || public = true",
    "viewRule": "user = @request.auth.id || public = true"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_Lcah")

  // remove field
  collection.fields.removeById("_clone_dYtO")

  // remove field
  collection.fields.removeById("_clone_GThg")

  // remove field
  collection.fields.removeById("_clone_zU2g")

  // remove field
  collection.fields.removeById("_clone_H2kC")

  // remove field
  collection.fields.removeById("_clone_RkS9")

  // remove field
  collection.fields.removeById("_clone_jfoG")

  // remove field
  collection.fields.removeById("_clone_A9bQ")

  // remove field
  collection.fields.removeById("_clone_h6Vg")

  // remove field
  collection.fields.removeById("_clone_7B9D")

  // remove field
  collection.fields.removeById("_clone_dkIV")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_zQ0E",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_46Dt",
    "max": 0,
    "min": 0,
    "name": "color",
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
    "id": "_clone_Qi7l",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_GsAU",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_fsxH",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_UTuK",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "folder",
      "video",
      "pdf",
      "image",
      "note",
      "ai"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_sQc0",
    "maxSelect": 99,
    "maxSize": 10000000,
    "mimeTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "attachments",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_UccJ",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_niDS",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_86bu",
    "maxSize": 0,
    "name": "messages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_j37g",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "listRule": "",
    "viewRule": ""
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Lcah",
    "max": 0,
    "min": 0,
    "name": "name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_dYtO",
    "max": 0,
    "min": 0,
    "name": "color",
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
    "id": "_clone_GThg",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_zU2g",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "parent",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_H2kC",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "_clone_RkS9",
    "maxSelect": 1,
    "name": "type",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "select",
    "values": [
      "folder",
      "video",
      "pdf",
      "image",
      "note",
      "ai"
    ]
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "_clone_jfoG",
    "maxSelect": 99,
    "maxSize": 10000000,
    "mimeTypes": [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp"
    ],
    "name": "attachments",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_A9bQ",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_h6Vg",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_7B9D",
    "maxSize": 0,
    "name": "messages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_dkIV",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("_clone_zQ0E")

  // remove field
  collection.fields.removeById("_clone_46Dt")

  // remove field
  collection.fields.removeById("_clone_Qi7l")

  // remove field
  collection.fields.removeById("_clone_GsAU")

  // remove field
  collection.fields.removeById("_clone_fsxH")

  // remove field
  collection.fields.removeById("_clone_UTuK")

  // remove field
  collection.fields.removeById("_clone_sQc0")

  // remove field
  collection.fields.removeById("_clone_UccJ")

  // remove field
  collection.fields.removeById("_clone_niDS")

  // remove field
  collection.fields.removeById("_clone_86bu")

  // remove field
  collection.fields.removeById("_clone_j37g")

  return app.save(collection)
})
