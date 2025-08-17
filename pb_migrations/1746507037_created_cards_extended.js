/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3208210256",
        "max": 0,
        "min": 0,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "json1336686135",
        "maxSize": 1,
        "name": "deck",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      }
    ],
    "id": "pbc_2545290406",
    "indexes": [],
    "listRule": null,
    "name": "cards_extended",
    "system": false,
    "type": "view",
    "updateRule": null,
    "viewQuery": "SELECT id, deck FROM CARDS;",
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406");

  return app.delete(collection);
})
