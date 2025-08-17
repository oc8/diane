/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_DgtFeAq5Yy` ON `user_push_tokens` (`token`)",
      "CREATE UNIQUE INDEX `idx_73cKQwGlcN` ON `user_push_tokens` (\n  `platform`,\n  `device_id`,\n  `user`\n)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2493827028",
    "max": 0,
    "min": 0,
    "name": "device_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_DgtFeAq5Yy` ON `user_push_tokens` (`token`)"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("text2493827028")

  return app.save(collection)
})
