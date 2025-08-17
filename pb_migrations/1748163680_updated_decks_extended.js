/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.created,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

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

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_fzlv",
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
    "id": "_clone_hbKy",
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
    "id": "_clone_WUoZ",
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
    "id": "_clone_BGH7",
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
    "id": "_clone_n3Ke",
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
    "id": "_clone_KjRw",
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
    "id": "_clone_cdRm",
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
    "id": "_clone_N9BG",
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
    "id": "_clone_n5QA",
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
    "id": "_clone_fu8q",
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
    "id": "_clone_qV4u",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_qBzM",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

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

  // remove field
  collection.fields.removeById("_clone_fzlv")

  // remove field
  collection.fields.removeById("_clone_hbKy")

  // remove field
  collection.fields.removeById("_clone_WUoZ")

  // remove field
  collection.fields.removeById("_clone_BGH7")

  // remove field
  collection.fields.removeById("_clone_n3Ke")

  // remove field
  collection.fields.removeById("_clone_KjRw")

  // remove field
  collection.fields.removeById("_clone_cdRm")

  // remove field
  collection.fields.removeById("_clone_N9BG")

  // remove field
  collection.fields.removeById("_clone_n5QA")

  // remove field
  collection.fields.removeById("_clone_fu8q")

  // remove field
  collection.fields.removeById("_clone_qV4u")

  // remove field
  collection.fields.removeById("_clone_qBzM")

  return app.save(collection)
})
