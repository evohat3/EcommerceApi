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

router.post('/', async (req, res) => {
 try {
  // create a new tag
const createTag = await Tag.create(
  {
    tag_name: req.body.tag_name,
  }
);

  if (!createTag) {
    res.status(400).json({message: 'unable to create Tag!'});
  }
  res.status(400).json({createTag});
 
} catch (err) {
  res.status(500).json({message: 'Internal Error!'})
}

});





router.put('/:id', async (req, res) => {

  try {
    const updateTag = await Tag.update(
      {
        tag_name: req.body.tag_name,
        products: req.body.tag_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
    res.status(200).json(updateTag);
  } catch {
    res.status(400).json({message: 'unable to update tag'})
  }

});

router.delete('/:id', async (req, res) => {
try {

  const deletedTag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  });

  if (!deletedTag) {
    res.status(404).json({message: 'Tag Id not found.'})
    } else {
    res.status(200).json({mesage: 'Tag Deleted!'})
    }
  } catch (err) {
    res.status(500).json({ message: 'Unknown Issue!' });
  }
});

module.exports = router;
