const express = require('express');
const Event = require('./models/events.js');
const Recipe = require('./models/recipes.js');
const app = express();

app.use(express.json());

app.post('/api/v1/events', (req, res, next) => {
  Event
    .insert(req.body)
    .then(event => res.send(event))
    .catch(next);
  console.log('hey girl hey');
});

app.post('/api/v1/recipes', (req, res, next) => {
  Recipe
    .insert(req.body)
    .then(recipe => res.send(recipe))
    .catch(next);
    console.log('wassup');
});

app.get('/api/v1/events/:id', (req, res, next) => {
  Event
    .findById(req.params.id)
    .then(event => res.send(event))
    .catch(next);

});
app.get('/api/v1/recipe/:id', (req, res, next) => {
  Recipe
    .findById(req.params.id)
    .then(recipe => res.send(recipe))
    .catch(next);
  
});

app.get('/api/v1/events', (req, res, next) => {
  Event
    .find()
    .then(event => res.send(event))
    .catch(next);
});

app.put('/api/v1/events/:id', (req, res, next) => {
  Event
    .update(req.params.id, req.body)
    .then(event => res.send(event))
    .catch(next);
});

app.delete('/api/v1/events/;id', (req, res, next) => {
  Event
    .delete(req.params.id)
    .then(event => res.send(event))
    .catch(next);
});

module.exports = app;
