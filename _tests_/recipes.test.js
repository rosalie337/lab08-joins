const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipes');

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

  it('finds a recipe by id via GET', async() => {
    const recipe = await Recipe.insert({
      ingredients:'2 plantains, 3 tlbs butter',
      instructions:'Melt butter in sauce pan on medium heat, add plantains'
    });

    const res = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    expect(res.body).toEqual(recipe);
  });

  it('finds all recipes via GET', async() => {
    const recipes = await Promise.all([
      { ingredients:'2 bananas, 3 tlbs butter' },
      { ingredients:'2 eggs, 3 tlbs butter' },
      { ingredients:'2 plantains, 3 tlbs butter' }
    ].map(recipe => Recipe.insert(recipe)));

    const response = await request(app)
      .get('/api/v1/recipes');

    expect(response.body).toEqual(expect.arrayContaining(recipes));
    expect(response.body).toHaveLength(recipes.length);
  });

}); 
