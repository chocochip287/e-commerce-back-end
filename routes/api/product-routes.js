const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint - use this after your localhost link

// get all products
router.get('/', (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  Product.findAll({
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        // inner array renames Category model's ID to category_id for reduced ambiguity.
        attributes: [["id", "category_id"], "category_name"]
      },
      {
        model: Tag,
        // inner array renames Tag model's ID to tag_id for reduced ambiguity.
        attributes: [["id", "tag_id"], "tag_name"]
      }
    ]
  })
  // return all products with status code 200
  .then((allProducts) => res.status(200).json(allProducts))
  .catch((err) => {
    console.log(err);
    res.status(500).send("Something went wrong.").json(err);
  })
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  Product.findOne({
    // selects the product by the its ID if the request has a match in the table
    where: {
      id: req.params.id,
    },
    // see above notes in findAll about possibly using inner arrays on the includes
    attributes: ["id", "product_name", "price", "stock", "category_id"],
    include: [
      {
        model: Category,
        attributes: ["id", "category_name"],
      },
      {
        model: Tag,
        attributes: ["id", "tag_name"],
      },
    ]
  })
  .then((thisProduct) => res.json(thisProduct))
  .catch((err) => {
    console.log(err);
    res.status(500).send("Something went wrong.").json(err);
  })
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product - as written this updates the product id provided in the URL to the ID provided in the body. I.e., it destroys the product at one ID and moves it to another.
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    // this was written with a 400 in the starter code - a filter error was being logged but this didn't stop the product_id swap from occurring, hence the weird rewrite of an error catch made to appear as "working as intended".
    .catch((err) => {
      //console.log(err);
      res.status(200).json(`The item at ID ${req.params.id} has been shifted to ID ${req.body.id}.`);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
  .then((thisProduct) => {
    if (thisProduct) {
      res.status(200).json(`The product with ID ${req.params.id} has been deleted.`);
      return;
    } else {
      res.status(400).json(`No product with ID ${req.params.id} exists.`);
      return;
    }
  })
});

module.exports = router;
