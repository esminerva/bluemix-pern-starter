let express = require('express');
let router = express.Router();

// CRUD operations for blog post
router.post('/', (req, res) => {
  if(!req.body || !req.body.title || !req.body.content) {
    res.status(400).send('title and content are required');
    return;
  }

  let blogPost = {
    title: req.body.title,
    content: req.body.content
  };

  req.Blog.create(blogPost)
    .then(data => {
      res.status(201).json(data);
    }).error(err => {
      console.log(err);
      res.status(500).send('Failed to create blog post');
    });
});

router.get('/', (req, res) => {
  req.Blog.findAll({
    order: [['updated_at', 'DESC']]
  }).then(data => {
    res.status(200).json(data);
  }).error(err => {
    console.log(err);
    res.status(500).send('Failed to query for blogs');
  });
});

router.get('/:id', (req, res) => {
  req.Blog.findById(req.params.id).then(data => {
    res.status(200).json(data);
  }).error(err => {
    console.log(err);
    res.status(500).send('Failed to query for blog with id: ' + req.params.id);
  });
});

router.put('/:id', (req, res) => {
  var blogPost = req.body;
  blogPost.id = req.params.id;

  req.Blog.update(blogPost, {
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.status(200).json(blogPost);
  }).error(err => {
    console.log(err);
    res.status(500).send('Failed to update blog');
  });
});

router.delete('/:id', (req, res) => {
  req.Blog.destroy({
    where: {
      id: req.params.id
    }
  }).then(() => {
    res.status(200).json(req.params.id);
  }).error(err => {
    console.log(err);
    res.status(500).send('Failed to delete blog');
  });
});

module.exports = router;