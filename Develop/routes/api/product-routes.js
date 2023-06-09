const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
try {
  // find all products
const allProducts = await Product.findAll({
    // be sure to include its associated Category and Tag data
  include: [{model: Category}, {model: Tag}],
});
res.status(200).json(allProducts);
} catch (err) {
  res.status(500).json(err);
}
});


// get one product
router.get('/:id', async (req, res) => {
  try {
  // find a single product by its `id`
const proID = await Product.findByPk(req.params.id, {
    // be sure to include its associated Category and Tag data
  include: [{model: Category}, {model: Tag}],
});

  if (!proID) {
    res.status(404).json({message: 'no product with that id'})
  }
    res.status(200).json(proID);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async (req, res) => {

  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

try {
const createProd = await Product.create(
  {
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: [],

  }
);

if (!createProd) {
  res.status(400).json({messsage: 'unable to create Product!'});
}
res.status(200).json(createProd);
} catch (err) {
  res.status(500).json({message: 'Internal Error!'})
}

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

// update product
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
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  try{ 
  // delete one product by its `id` value
const deleteProd = await Product.destroy({
  where: {
    id: req.params.id,
  },
});

  if (deleteProd) {
    res.json({message: 'Product Deleted'});
    } else {
      res.json({message: 'Product Not Found'});
    }
  } catch (err) {
    res.status(500).json({ message: 'Unkown Issue!'});
  }

});

module.exports = router;
