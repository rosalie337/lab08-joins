const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Event = require('../lib/models/events');
const Recipe = require('../lib/models/recipes');
const { Events } = require('pg');

describe('event routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('create a new event via POST', async() => {
    const response = await request(app)
      .post('/api/v1/events')
      .send({
        title: 'Friendsgiving',
        date: '2021-11-23',
        attendees: 'some friends'
      });

    expect(response.body).toEqual({
      id: '1',
      title: 'Friendsgiving',
      date: expect.any(String),
      attendees: 'some friends'
    });
  });

  it('finds a event by id via GET', async() => {
    await Promise.all([
      { ingredients:'3 tablespoons sage', instructions:'cook it and stir' },
      { ingredients:'1 tablespoons butter', instructions:'cook it and stir' },
      
    ].map(recipe => Recipe.insert(recipe)));

    const event = await Event.insert({
      title: 'New Years', date: '2021-01-01', attendees: 'some people',
      ingredients:['1 tablespoons butter', '3 tablespoons sage']
    });

    const response = await request(app)
      .get(`/api/v1/events/${event.id}`);
    
    expect(response.body).toEqual({
      ...event,
      date: expect.anything(),

      recipes: [{ id: 1, ingredients:'3 tablespoons sage', instructions:'cook it and stir' },
        { id: 2, ingredients:'1 tablespoons butter', instructions:'cook it and stir' }]
    });
  });

  it('finds all events via GET', async() => {
    const events = await Promise.all([
      { title: 'Friendsgiving' },
      { title: 'Christmas' },
      { title: 'Birthday' },
    ].map(event => Event.insert(event)));

    const response = await request(app)
      .get('/api/v1/events');

    expect(response.body).toEqual(expect.arrayContaining(events));
    expect(response.body).toHaveLength(events.length);
  });

  it('updates an event via PUT', async() => {
    const event = await Event.insert({
      title: 'My First Event',
      date: '2021-11-23',
      attendees: 'some friends'
    });

    const response = await request(app)
      .put(`/api/v1/events/${event.id}`)
      .send({
        title: 'My Third Event',
        date: '2021-01-23',
        attendees: 'some friends'
      });

    expect(response.body).toEqual({
      id: event.id,
      title: 'My Third Event',
      date: expect.anything(),
      attendees: 'some friends'
    });
  });

  it('deletes an event by id', async() => {
    const event = await Event.insert({
      title: 'My First Event'
    });

    const response = await request(app)
      .delete(`/api/v1/events/${event.id}`);

    expect(response.body).toEqual(event);
  });
});
