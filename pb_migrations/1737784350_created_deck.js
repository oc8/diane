/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Check if collection already exists, exit early if it does
  try {
    const existingCollection = app.findCollectionByNameOrId("pbc_1755402631");
    if (existingCollection) {
      console.log("Collection 'decks' already exists. Skipping creation.");
      return null;
    }
  } catch {
    // Collection doesn't exist, continue with creation
  }
  
  const collection = new Collection({
    id: "pbc_1755402631",
    name: "decks",
    type: "base",
    system: false,
    schema: [
      {
        "system": false,
        "id": "text1579384326",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "text1716930793",
        "name": "color",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "relation1542800728",
        "name": "user",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      }
    ],
    listRule: "",
    viewRule: "",
    createRule: "",
    updateRule: "",
    deleteRule: "",
    options: {}
  });

  return app.save(collection);
}, (app) => {
  // Rollback function - delete the collection if migration needs to be undone
  app.collections.remove("pbc_1755402631");
  
  return app.save();
});
