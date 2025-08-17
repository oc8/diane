/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.slug,\n    d.name,\n    d.color,\n    d.icon,\n    d.description,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    d.content,\n    d.tags,\n    d.note_type,\n    (SELECT name FROM types WHERE id = d.note_type) as note_type_name,\n    (SELECT key FROM types WHERE id = d.note_type) as note_type_key,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // remove field
  collection.fields.removeById("json2560465762")

  // remove field
  collection.fields.removeById("_clone_hgKA")

  // remove field
  collection.fields.removeById("_clone_RAOI")

  // remove field
  collection.fields.removeById("_clone_fTKB")

  // remove field
  collection.fields.removeById("_clone_cvqg")

  // remove field
  collection.fields.removeById("_clone_icsm")

  // remove field
  collection.fields.removeById("_clone_yQza")

  // remove field
  collection.fields.removeById("_clone_G6H4")

  // remove field
  collection.fields.removeById("_clone_UNSq")

  // remove field
  collection.fields.removeById("_clone_UnDy")

  // remove field
  collection.fields.removeById("_clone_HSFp")

  // remove field
  collection.fields.removeById("_clone_WtaH")

  // remove field
  collection.fields.removeById("_clone_w3Zk")

  // remove field
  collection.fields.removeById("_clone_NE6I")

  // remove field
  collection.fields.removeById("_clone_o2yW")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_sQia",
    "max": 0,
    "min": 0,
    "name": "slug",
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
    "id": "_clone_LMiU",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_QTLA",
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
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_IbW2",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_O4UD",
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
    "id": "_clone_KaKm",
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
  collection.fields.addAt(7, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_Pv1z",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_TP6z",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_TuSF",
    "maxSize": 0,
    "name": "messages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_RYes",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_0HR2",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_KDmL",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "_clone_dYB3",
    "maxSize": 0,
    "name": "content",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_9mBC",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2457221083",
    "hidden": false,
    "id": "_clone_Iket",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "note_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    REPLACE(LOWER(d.name), ' ', '-') AS slug,\n    d.name,\n    d.color,\n    d.icon,\n    d.description,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    d.content,\n    d.tags,\n    d.note_type,\n    (SELECT name FROM types WHERE id = d.note_type) as note_type_name,\n    (SELECT key FROM types WHERE id = d.note_type) as note_type_key,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json2560465762",
    "maxSize": 1,
    "name": "slug",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_hgKA",
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
  collection.fields.addAt(3, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_RAOI",
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
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_fTKB",
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
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_cvqg",
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
    "id": "_clone_icsm",
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
  collection.fields.addAt(7, new Field({
    "exceptDomains": null,
    "hidden": false,
    "id": "_clone_yQza",
    "name": "url",
    "onlyDomains": null,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "url"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "cascadeDelete": true,
    "collectionId": "_pb_users_auth_",
    "hidden": false,
    "id": "_clone_G6H4",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "user",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "_clone_UNSq",
    "maxSize": 0,
    "name": "messages",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "hidden": false,
    "id": "_clone_UnDy",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_HSFp",
    "maxSize": 0,
    "name": "links",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "_clone_WtaH",
    "name": "created",
    "onCreate": true,
    "onUpdate": false,
    "presentable": false,
    "system": false,
    "type": "autodate"
  }))

  // add field
  collection.fields.addAt(13, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "_clone_w3Zk",
    "maxSize": 0,
    "name": "content",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  // add field
  collection.fields.addAt(14, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1755402631",
    "hidden": false,
    "id": "_clone_NE6I",
    "maxSelect": 999,
    "minSelect": 0,
    "name": "tags",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "cascadeDelete": true,
    "collectionId": "pbc_2457221083",
    "hidden": false,
    "id": "_clone_o2yW",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "note_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_sQia")

  // remove field
  collection.fields.removeById("_clone_LMiU")

  // remove field
  collection.fields.removeById("_clone_QTLA")

  // remove field
  collection.fields.removeById("_clone_IbW2")

  // remove field
  collection.fields.removeById("_clone_O4UD")

  // remove field
  collection.fields.removeById("_clone_KaKm")

  // remove field
  collection.fields.removeById("_clone_Pv1z")

  // remove field
  collection.fields.removeById("_clone_TP6z")

  // remove field
  collection.fields.removeById("_clone_TuSF")

  // remove field
  collection.fields.removeById("_clone_RYes")

  // remove field
  collection.fields.removeById("_clone_0HR2")

  // remove field
  collection.fields.removeById("_clone_KDmL")

  // remove field
  collection.fields.removeById("_clone_dYB3")

  // remove field
  collection.fields.removeById("_clone_9mBC")

  // remove field
  collection.fields.removeById("_clone_Iket")

  return app.save(collection)
})
