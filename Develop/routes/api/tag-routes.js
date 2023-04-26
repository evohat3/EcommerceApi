const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
  // find all tags
  const tagsData = await Tag.findAll({
    include: [{model: Product}]
  }
      // be sure to include its associated Product data
  );
  res.status(200).json(tagsData);

  } catch (err) {
  res.status(500).json(err);
  }


});

router.get('/:id', async (req, res) => {
  try {
  // find a single tag by its `id`
  const tagID = await Tag.findByPk(req.params.id, {
      // be sure to include its associated Product data
    include: [{model: Product}],
  });

  if (!tagID) {
    res.status(404).json({mesage: 'no tag with that id!'});
  }
  res.status(200).json(tagID);
  } catch (err) {
    res.status(500).json(err)
  }

});

router.post('/', (req, res) => {
  // create a new tag
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
