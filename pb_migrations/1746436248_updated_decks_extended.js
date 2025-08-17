/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_914856357")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT id, name, color, progress, icon FROM 'decks';"
  }, collection)

  // add field
  collection.fields.addAt(1, new Field({
    "hidden": false,
    "id": "json1579384326",
    "maxSize": 1,
    "name": "name",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "hidden": false,
    "id": "json1716930793",
    "maxSize": 1,
    "name": "color",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "json570552902",
    "maxSize": 1,
    "name": "progress",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "json1704208859",
    "maxSize": 1,
    "name": "icon",
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
    "viewQuery": "SELECT id FROM 'decks';"
  }, collection)

  // remove field
  collection.fields.removeById("json1579384326")

  // remove field
  collection.fields.removeById("json1716930793")

  // remove field
  collection.fields.removeById("json570552902")

  // remove field
  collection.fields.removeById("json1704208859")

  return app.save(collection)
})
