/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_823787363")

  // remove field
  collection.fields.removeById("file1204091606")

  return app.save(collection)
})
