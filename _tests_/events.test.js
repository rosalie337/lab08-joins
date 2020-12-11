const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

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
});
