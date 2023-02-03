const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint - use this after your localhost link

router.get('/', (req, res) => {
  // find all categories
  // be sure to include its associated Products
  Category.findAll({
    attributes: ["id", "tag_name"],
    include: [{
      model: Product,
      // inner array on ID renames the column to product_id for reduced ambiguity
      attributes: [["id", "product_id"], "product_name"]
    }]
  })
  then((allCats) => res.status(200).json(allCats))
  .catch((err) => {
    res.status(500).json(`Something went wrong - ${err}`);
  })
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  Category.findOne({
    // selects the category by its ID if the request has a match in the table
    where: {
      id: req.params.id,
    },
    attributes: ["id", "tag_name"],
    // inner array renames different model ID to reduce ambiguity
    include: [{
      model: Product,
      attributes: [["id", "product_id"], "product_name"]
    }]
  })
  then((thisCat) => res.json(thisCat))
  .catch((err) => {
    res.status(500).json(`Something went wrong - ${err}`);
  })
});

router.post('/', (req, res) => {
  // create a new category
  // use a little json formatted like so as the body: { "category_name": "name_here" }
  Category.create({
    category_name: req.body.category_name
  })
  .then((newCat) => res.json(newCat))
  .catch((err) => res.status(500).json(`Something went wrong - ${err}`));
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value indicated in the URL
  // same as with the post - use a json like so in the body: { "category_name": "name_here" }
  Category.update({
    category_name: req.body.category_name
  },
  {
    where: {
      id: req.params.id
    }
  })
  .then((catUpdate) => {
    if(catUpdate) {
      res.status(200).json(`The category at ID ${req.params.id} has been updated to ${req.body.category_name}.`);
    } else {
      res.status(500).json(`Something went wrong - ${err}`);
    }
  });
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value specified in the URL
  Category.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((thisCat) => {
    if (thisCat) {
      res.status(200).json(`The category with ID ${req.params.id}.`);
    } else {
      res.status(400).json(`No category with ID ${req.params.id} exists.`);
    }
  })
});

module.exports = router;
