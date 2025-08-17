/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    d.content,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_rL2D")

  // remove field
  collection.fields.removeById("_clone_vPBF")

  // remove field
  collection.fields.removeById("_clone_qskR")

  // remove field
  collection.fields.removeById("_clone_j7L7")

  // remove field
  collection.fields.removeById("_clone_0G5b")

  // remove field
  collection.fields.removeById("_clone_7yXZ")

  // remove field
  collection.fields.removeById("_clone_OxdB")

  // remove field
  collection.fields.removeById("_clone_OcYD")

  // remove field
  collection.fields.removeById("_clone_2J8B")

  // remove field
  collection.fields.removeById("_clone_aNgu")

  // remove field
  collection.fields.removeById("_clone_jFWh")

  // remove field
  collection.fields.removeById("_clone_QrDE")

  // remove field
  collection.fields.removeById("_clone_TX4A")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_cPKH",
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
    "id": "_clone_gLZq",
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
    "id": "_clone_5XHO",
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
    "id": "_clone_t4ma",
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
    "id": "_clone_xuCC",
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
    "id": "_clone_Q3BJ",
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
    "id": "_clone_wwlV",
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
    "id": "_clone_Rn2v",
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
    "id": "_clone_z7lB",
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
    "id": "_clone_agVp",
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
    "id": "_clone_chdT",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_5YBN",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_BIsx",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "_clone_yxLa",
    "maxSize": 5,
    "name": "content",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.name,\n    d.color,\n    d.icon,\n    d.parent,\n    d.description,\n    d.type,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_rL2D",
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
    "id": "_clone_vPBF",
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
    "id": "_clone_qskR",
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
    "id": "_clone_j7L7",
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
    "id": "_clone_0G5b",
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
    "id": "_clone_7yXZ",
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
    "id": "_clone_OxdB",
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
    "id": "_clone_OcYD",
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
    "id": "_clone_2J8B",
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
    "id": "_clone_aNgu",
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
    "id": "_clone_jFWh",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_QrDE",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "hidden": false,
    "id": "_clone_TX4A",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // remove field
  collection.fields.removeById("_clone_cPKH")

  // remove field
  collection.fields.removeById("_clone_gLZq")

  // remove field
  collection.fields.removeById("_clone_5XHO")

  // remove field
  collection.fields.removeById("_clone_t4ma")

  // remove field
  collection.fields.removeById("_clone_xuCC")

  // remove field
  collection.fields.removeById("_clone_Q3BJ")

  // remove field
  collection.fields.removeById("_clone_wwlV")

  // remove field
  collection.fields.removeById("_clone_Rn2v")

  // remove field
  collection.fields.removeById("_clone_z7lB")

  // remove field
  collection.fields.removeById("_clone_agVp")

  // remove field
  collection.fields.removeById("_clone_chdT")

  // remove field
  collection.fields.removeById("_clone_5YBN")

  // remove field
  collection.fields.removeById("_clone_BIsx")

  // remove field
  collection.fields.removeById("_clone_yxLa")

  return app.save(collection)
})
