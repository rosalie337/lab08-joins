const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../models/recipes');

describe('event routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('create a new event via POST', async() => {
    const response = await request(app)
      .post('/api/v1/recipe')
      .send({
        title: 'Friendsgiving',
        date: 11 - 23 - 2021,
        attendees: 'someUser1, someUser2, someUser4'
        
      });

    expect(response.body).toEqual({
      id: '1',
      title: 'Friendsgiving',
      date: 11 - 23 - 2021,
      attendees: 'someUser1, someUser2, someUser4'  
    });
  });

  it('finds an event by id via GET', async() => {
    await Promise.all([
      { title: 'Friendsgiving' },
      { title: 'Christmas' },
      { title: 'Birthday' },
    ].map(recipe => Recipe.insert(recipe)));

    const event = await Event.insert({
      title: 'New Years Party',
      recipes: ['Black Eye Peas with Hamhock', 'Sparkling Ice Cream']
    });

    const response = await request(app)
      .get(`/api/v1/events/${event.id}`);

    expect(response.body).toEqual({
      ...event,
      recipes: ['Black Eye Peas with Hamhock', 'Sparkling Ice Cream']  
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
      title: 'My First Event'
    });

    const response = await request(app)
      .put(`/api/v1/events/${event.id}`)
      .send({
        title: 'My Third Event'
      });

    expect(response.body).toEqual({
      id: event.id,
      title: 'My Third Event'
    });
  });

  it('deletes a event by id', async() => {
    const event = await Event.insert({
      title: 'Friendsgiving'
    });

    const response = await request(app)
      .delete(`/api/v1/events/${event.id}`);

    expect(response.body).toEqual(event);
  });
});
