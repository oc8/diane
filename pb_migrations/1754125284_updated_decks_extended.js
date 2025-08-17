/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.slug,\n    d.name,\n    d.color,\n    d.icon,\n    d.description,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    d.content,\n    d.tags,\n    d.note_type,\n    d.loading,\n    (SELECT name FROM types WHERE id = d.note_type) as note_type_name,\n    (SELECT key FROM types WHERE id = d.note_type) as note_type_key,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // remove field
  collection.fields.removeById("_clone_j9eI")

  // remove field
  collection.fields.removeById("_clone_12YY")

  // remove field
  collection.fields.removeById("_clone_kb3E")

  // remove field
  collection.fields.removeById("_clone_KAU3")

  // remove field
  collection.fields.removeById("_clone_8ARV")

  // remove field
  collection.fields.removeById("_clone_Dt5M")

  // remove field
  collection.fields.removeById("_clone_DHrC")

  // remove field
  collection.fields.removeById("_clone_XvX8")

  // remove field
  collection.fields.removeById("_clone_oA6A")

  // remove field
  collection.fields.removeById("_clone_JASI")

  // remove field
  collection.fields.removeById("_clone_4wqr")

  // remove field
  collection.fields.removeById("_clone_CHqI")

  // remove field
  collection.fields.removeById("_clone_0ZzI")

  // remove field
  collection.fields.removeById("_clone_KyJS")

  // remove field
  collection.fields.removeById("_clone_CXDG")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_Thsy",
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
    "id": "_clone_kmEm",
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
    "id": "_clone_zi8P",
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
    "id": "_clone_9tq1",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_xZCq",
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
    "id": "_clone_Nwcw",
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
    "id": "_clone_cLWj",
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
    "id": "_clone_BALM",
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
    "id": "_clone_Nk63",
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
    "id": "_clone_k03z",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_qt7x",
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
    "id": "_clone_o3hz",
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
    "id": "_clone_Yur9",
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
    "id": "_clone_J6EP",
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
    "id": "_clone_qdEa",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "note_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "_clone_RN1v",
    "maxSize": 0,
    "name": "loading",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n    d.id,\n    d.slug,\n    d.name,\n    d.color,\n    d.icon,\n    d.description,\n    d.attachments,\n    d.url,\n    d.user,\n    d.messages,\n    d.public,\n    d.links,\n    d.created,\n    d.content,\n    d.tags,\n    d.note_type,\n    (SELECT name FROM types WHERE id = d.note_type) as note_type_name,\n    (SELECT key FROM types WHERE id = d.note_type) as note_type_key,\n    (SELECT COUNT(*) FROM cards WHERE deck = d.id AND type != 'quiz') AS total_cards,\n    (SELECT COUNT(*) FROM cards WHERE \n        deck = d.id AND \n        (last_review = \"\" OR \n         datetime(last_review, '+' || (step * 2) || ' days') <= CURRENT_TIMESTAMP)\n    ) AS cards_to_review\nFROM decks d;"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_j9eI",
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
    "id": "_clone_12YY",
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
    "id": "_clone_kb3E",
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
    "id": "_clone_KAU3",
    "max": 0,
    "min": 0,
    "name": "icon",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": true,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "_clone_8ARV",
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
    "id": "_clone_Dt5M",
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
    "id": "_clone_DHrC",
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
    "id": "_clone_XvX8",
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
    "id": "_clone_oA6A",
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
    "id": "_clone_JASI",
    "name": "public",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "_clone_4wqr",
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
    "id": "_clone_CHqI",
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
    "id": "_clone_0ZzI",
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
    "id": "_clone_KyJS",
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
    "id": "_clone_CXDG",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "note_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // remove field
  collection.fields.removeById("_clone_Thsy")

  // remove field
  collection.fields.removeById("_clone_kmEm")

  // remove field
  collection.fields.removeById("_clone_zi8P")

  // remove field
  collection.fields.removeById("_clone_9tq1")

  // remove field
  collection.fields.removeById("_clone_xZCq")

  // remove field
  collection.fields.removeById("_clone_Nwcw")

  // remove field
  collection.fields.removeById("_clone_cLWj")

  // remove field
  collection.fields.removeById("_clone_BALM")

  // remove field
  collection.fields.removeById("_clone_Nk63")

  // remove field
  collection.fields.removeById("_clone_k03z")

  // remove field
  collection.fields.removeById("_clone_qt7x")

  // remove field
  collection.fields.removeById("_clone_o3hz")

  // remove field
  collection.fields.removeById("_clone_Yur9")

  // remove field
  collection.fields.removeById("_clone_J6EP")

  // remove field
  collection.fields.removeById("_clone_qdEa")

  // remove field
  collection.fields.removeById("_clone_RN1v")

  return app.save(collection)
})
