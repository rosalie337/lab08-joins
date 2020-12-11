const express = require('express');
const { findById } = require('./lib/models/events');
const Event = require('./model/events');
const app = express();

app.use(express.json());

app.post('/api/v1/events', (req, res, next) => {
  Event
    .insert(req.body)
    .then(event => res.send(event))
    .catch(next);
});

app.get('/api/v1/events/:id', (req, res, next) => {
  Event
    .findById(req.params.id)
    .then(event => res.send(event))
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
