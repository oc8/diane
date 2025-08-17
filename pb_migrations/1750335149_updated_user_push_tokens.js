/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_73cKQwGlcN` ON `user_push_tokens` (\n  `platform`,\n  `device_id`,\n  `user`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_915716030")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_DgtFeAq5Yy` ON `user_push_tokens` (`token`)",
      "CREATE UNIQUE INDEX `idx_73cKQwGlcN` ON `user_push_tokens` (\n  `platform`,\n  `device_id`,\n  `user`\n)"
    ]
  }, collection)

  return app.save(collection)
})
