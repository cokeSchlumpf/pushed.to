const _ = require('lodash');
const graphql = require('graphql').graphql;
const express = require('express');
const Promise = require('promise');

const router = express.Router();
const schema = require('../data/schema');
const blogQuery = require('../data/queries/blog');
const postsQuery = require('../data/queries/posts');
const postQuery = require('../data/queries/post');

router.get('/:user/:project', (req, res) => {
    Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project))
          ])
      .then(responses => {
          res.locals.blog = responses[0].data.blog;
          res.locals.posts = responses[1].data.posts;

          res.render('posts');
      });
  });

router.get('/:user/:project/history/:page', (req, res) => {
  Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postsQuery(req.params.user, req.params.project, req.params.page))
          ])
      .then(responses => {
          res.locals.blog = responses[0].data.blog;
          res.locals.posts = responses[1].data.posts;

          res.render('posts');
      });
})

router.use('/:user/:project/posts', (req, res) => {
    if (!_.endsWith(req.url,  '.md')) {
      req.url = req.url + '.md';
    }

    Promise
      .all(
          [ 
            graphql(schema, blogQuery(req.params.user, req.params.project)),
            graphql(schema, postQuery(req.params.user, req.params.project, req.url.substr(1)))
          ])
      .then(responses => {
          res.locals.blog = responses[0].data.blog;
          res.locals.post = responses[1].data.post;
          res.locals.posts = {
            posts: []
          };
          
          res.render('post');
      });
})

module.exports = router;