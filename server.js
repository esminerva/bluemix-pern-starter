'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const blogsRoutes = require('./server/routers/blogs');

app.use(bodyParser.json());

// Emulating VCAP_VARIABLES if running in local mode
try { require("./vcap-local"); } catch (e) {}

const Sequelize = require('sequelize');
const sequelize = require('./server/utils/pg');

const Blog = sequelize.define('blog', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT
}, {
  timestamps: true,
  underscored: true
});

// AppMetrics monitoring instrumentation
require('appmetrics-dash').attach();


// Define public endpoints
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/app/views'));

const useBlog = (req, response, next) => {
  req.Blog = Blog;
  next();
};

app.use('/api/blogs', useBlog, blogsRoutes);

Blog.sync()
  .then(function() {
    // Starting the server
    const port = 'PORT' in process.env ? process.env.PORT : 8080;
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  }).catch(function(err) {
  console.log(err);
  process.exit(1);
});