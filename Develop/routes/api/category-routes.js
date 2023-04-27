const router = require('express').Router();
const { Category, Product} = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  try {
    const categoryData = await Category.findAll();
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {

  try {
     // find one category by its `id` value
  const catID = await Category.findByPk(req.params.id
  );

  if (!catID) {
    res.status(404).json({message: 'no category with that id!'});
  }
  res.status(200).json(catID);
  } catch (err) {
    res.status(500).json({message: 'unknown issue'});
  }
 

});



router.post('/', async (req, res) => {
  // create a new category
  try {
    const catMake = await Category.create(req.body);

    if (!catMake) {
      res.status(400).json({message: 'unable to create category!'})
    }
    res.status(200).json(catMake);
  } catch (err) {
    res.status(500).json({message: 'internal error'})
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
 
    const updateCat = await Category
    .update( 
      {
        category_name: req.body.category_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
        res.json(updateCat);
});

router.delete('/:id', async (req, res) => {
  try {
    // delete a category by its `id` value
    const deletedCat = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    
    if (deletedCat) {
      res.status(200).json({ message: 'Category deleted' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Unknown Issue!' });
  }
});

module.exports = router;
