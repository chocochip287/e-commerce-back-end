const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint - use this after your localhost link

router.get('/', (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  Tag.findAll({
    attributes: ["id", "tag_name"],
    include: [
      {
        model: Product,
        // inner array on ID renames the column to product_id for reduced ambiguity
        attributes: [["id", "product_id"], "product_name"]
      },
    ],
  })
  .then((allTags) => res.status(200).json(allTags))
  .catch((err) => {
    res.status(500).json(`Something went wrong - ${err}`);
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  Tag.findOne({
    // selects the tag by its ID if the request has a match in the table
    where: {
      id: req.params.id,
    },
    attributes: ["id", "tag_name"],
    include: [
      {
        model: Product,
        // inner array on ID renames the column to product_id for reduced ambiguity
        attributes: [["id", "product_id"], "product_name"]
      },
    ],
  })
  .then((allTags) => res.status(200).json(allTags))
  .catch((err) => {
    res.status(500).json(`Something went wrong - ${err}`);
  })
})

router.post('/', (req, res) => {
  // create a new tag
  // use a little json formatted like so as the body: { "tag_name": "name_here" }
  Tag.create({
    tag_name: req.body.tag_name
  })
  .then((newTag) => res.json(newTag))
  .catch((err) => res.status(500).json(`Something went wrong - ${err}`));
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value indicated in the URL
  // same as with the post - use a json like so in the body: { "tag_name": "name_here" }
  Tag.update({
    tag_name: req.body.tag_name
  },
  {
    where: {
      id: req.params.id
    }
  })
  .then((tagUpdate) => {
    if (tagUpdate) {
      res.status(200).json(`The tag at ID ${req.params.id} has been updated to ${req.body.tag_name}.`);
    } else {
      res.status(500).json(`Something went wrong - ${err}`);
    }
  });
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value specified in the URL
  Tag.destroy({
    where: {
      id: req.params.id
    },
  })
  .then((thisTag) => {
    if (thisTag) {
      res.status(200).json(`The tag with ID ${req.params.id} has been deleted.`);
    } else {
      res.status(400).json(`No tag with ID ${req.params.id} exists.`);
    }
  })
});

module.exports = router;
