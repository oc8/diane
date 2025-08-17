/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT \n  id, \n  deck, \n  question, \n  answer, \n  choices, \n  last_review, \n  step, \n  type, \n  (datetime(COALESCE(last_review, CURRENT_TIMESTAMP), '+' || (step * 2) || ' days')) AS next_review_date\n  FROM CARDS;"
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "json1257799299",
    "maxSize": 1,
    "name": "next_review_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "json"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2545290406")

  // update collection data
  unmarshal({
    "viewQuery": "SELECT id, deck, question, answer, choices, last_review, step, type FROM CARDS;"
  }, collection)

  // remove field
  collection.fields.removeById("json1257799299")

  return app.save(collection)
})
