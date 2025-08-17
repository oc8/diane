/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Check if collection already exists, exit early if it does
  try {
    const existingCollection = app.findCollectionByNameOrId("pbc_823787363");
    if (existingCollection) {
      console.log("Collection 'card' already exists. Skipping creation.");
      return null;
    }
  } catch {
    // Collection doesn't exist, continue with creation
  }
  
  const collection = new Collection({
    id: "pbc_823787363",
    name: "card",
    type: "base",
    system: false,
    schema: [
      {
        "system": false,
        "id": "text3069659470",
        "name": "question",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
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
  app.collections.remove("pbc_823787363");
  
  return app.save();
});
