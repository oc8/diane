/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // remove field
  collection.fields.removeById("file1204091606")

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text315797377",
    "max": 0,
    "min": 0,
    "name": "medias",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // add field
  collection.fields.addAt(14, new Field({
    "hidden": false,
    "id": "file1204091606",
    "maxSelect": 99,
    "maxSize": 0,
    "mimeTypes": [
      "image/png",
      "image/jpeg",
      "image/svg+xml"
    ],
    "name": "attachments",
    "presentable": false,
    "protected": false,
    "required": false,
    "system": false,
    "thumbs": [],
    "type": "file"
  }))

  // remove field
  collection.fields.removeById("text315797377")

  return app.save(collection)
})
