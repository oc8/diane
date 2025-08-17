/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.public,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_kQP4")

  // remove field
  collection.fields.removeById("_clone_XbJA")

  // remove field
  collection.fields.removeById("_clone_izNW")

  // remove field
  collection.fields.removeById("_clone_ZWBe")

  // remove field
  collection.fields.removeById("_clone_Ms4X")

  // remove field
  collection.fields.removeById("_clone_Qvyu")

  // remove field
  collection.fields.removeById("_clone_IGSo")

  // remove field
  collection.fields.removeById("_clone_AmV5")

  // remove field
  collection.fields.removeById("_clone_hKoU")

  // remove field
  collection.fields.removeById("_clone_REtQ")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Y6Bj",
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
    "id": "_clone_0hdJ",
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
    "id": "_clone_dSeX",
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
    "id": "_clone_Ec9K",
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
    "id": "_clone_nMit",
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
    "id": "_clone_fNpN",
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
    "id": "_clone_NTC0",
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
    "id": "_clone_8yrb",
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
    "id": "_clone_vhoO",
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
    "id": "_clone_UWnq",
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
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.public,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review IS NULL OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_kQP4",
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
    "id": "_clone_XbJA",
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
    "id": "_clone_izNW",
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
    "id": "_clone_ZWBe",
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
    "id": "_clone_Ms4X",
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
    "id": "_clone_Qvyu",
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
    "id": "_clone_IGSo",
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
    "id": "_clone_AmV5",
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
    "id": "_clone_hKoU",
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
    "id": "_clone_REtQ",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // remove field
  collection.fields.removeById("_clone_Y6Bj")

  // remove field
  collection.fields.removeById("_clone_0hdJ")

  // remove field
  collection.fields.removeById("_clone_dSeX")

  // remove field
  collection.fields.removeById("_clone_Ec9K")

  // remove field
  collection.fields.removeById("_clone_nMit")

  // remove field
  collection.fields.removeById("_clone_fNpN")

  // remove field
  collection.fields.removeById("_clone_NTC0")

  // remove field
  collection.fields.removeById("_clone_8yrb")

  // remove field
  collection.fields.removeById("_clone_vhoO")

  // remove field
  collection.fields.removeById("_clone_UWnq")

  return app.save(collection)
})
