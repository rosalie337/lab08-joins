const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');

describe('recipes routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('create a new recipe via POST', async() => {
    const response = await request(app)
      .post('/api/v1/recipes')
      .send({
        ingredients:'3 tablespoons sage',
        instructions:'cook it and stir'
      });

    expect(response.body).toEqual({
      id: '1',
      ingredients:'3 tablespoons sage',
      instructions:'cook it and stir'
    });
  });
}); 
