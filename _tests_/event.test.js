const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../app.js');

describe('recipes routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('create a new recipe via POST', async() => {
    const response = await request(app)
      .post('/api/v1/recipe')
      .send({
        recipe_photo: 'food.png',
        ingredients:`3 tablespoons butter plus 1 tablespoon for tossing the pasta,
            ½ cup chopped onion,
            ⅔ cup chopped celery,
            ⅔ cup chopped carrot,
            ¾ pound ground beef chuck (or you can use 1 part pork to 2 parts beef),
             Salt,
             Black pepper, ground fresh from the mill,
            1 cup whole milk,
             Whole nutmeg,
            1 cup dry white wine,
            1 ½ cups canned imported Italian plum tomatoes, cut up, with their juice,
            1 ¼ to 1 ½ pounds pasta,
             Freshly grated parmigiano-reggiano cheese at the table`,
        instructions:` Put the oil, butter and chopped onion in the pot and turn the heat on to medium. Cook and stir the onion until it has become translucent, then add the chopped celery and carrot. Cook for about 2 minutes, stirring vegetables to coat them well.
        Add ground beef, a large pinch of salt and a few grindings of pepper. Crumble the meat with a fork, stir well and cook until the beef has lost its raw, red color.
        Add milk and let it simmer gently, stirring frequently, until it has bubbled away completely. Add a tiny grating -- about 1/8 teaspoon -- of nutmeg, and stir.
        Add the wine, let it simmer until it has evaporated, then add the tomatoes and stir thoroughly to coat all ingredients well. When the tomatoes begin to bubble, turn the heat down so that the sauce cooks at the laziest of simmers, with just an intermittent bubble breaking through to the surface. Cook, uncovered, for 3 hours or more, stirring from time to time. While the sauce is cooking, you are likely to find that it begins to dry out and the fat separates from the meat. To keep it from sticking, add 1/2 cup of water whenever necessary. At the end, however, no water at all must be left and the fat must separate from the sauce. Taste and correct for salt.
        Toss with cooked drained pasta, adding the tablespoon of butter, and serve with freshly grated Parmesan on the side.`
        
      });

    expect(response.body).toEqual({
      id: '1',
      recipe_photo: 'food.png',
      ingredients:`3 tablespoons butter plus 1 tablespoon for tossing the pasta,
          ½ cup chopped onion,
          ⅔ cup chopped celery,
          ⅔ cup chopped carrot,
          ¾ pound ground beef chuck (or you can use 1 part pork to 2 parts beef),
           Salt,
           Black pepper, ground fresh from the mill,
          1 cup whole milk,
           Whole nutmeg,
          1 cup dry white wine,
          1 ½ cups canned imported Italian plum tomatoes, cut up, with their juice,
          1 ¼ to 1 ½ pounds pasta,
           Freshly grated parmigiano-reggiano cheese at the table`,
      instructions:` Put the oil, butter and chopped onion in the pot and turn the heat on to medium. Cook and stir the onion until it has become translucent, then add the chopped celery and carrot. Cook for about 2 minutes, stirring vegetables to coat them well.
      Add ground beef, a large pinch of salt and a few grindings of pepper. Crumble the meat with a fork, stir well and cook until the beef has lost its raw, red color.
      Add milk and let it simmer gently, stirring frequently, until it has bubbled away completely. Add a tiny grating -- about 1/8 teaspoon -- of nutmeg, and stir.
      Add the wine, let it simmer until it has evaporated, then add the tomatoes and stir thoroughly to coat all ingredients well. When the tomatoes begin to bubble, turn the heat down so that the sauce cooks at the laziest of simmers, with just an intermittent bubble breaking through to the surface. Cook, uncovered, for 3 hours or more, stirring from time to time. While the sauce is cooking, you are likely to find that it begins to dry out and the fat separates from the meat. To keep it from sticking, add 1/2 cup of water whenever necessary. At the end, however, no water at all must be left and the fat must separate from the sauce. Taste and correct for salt.
      Toss with cooked drained pasta, adding the tablespoon of butter, and serve with freshly grated Parmesan on the side.` });
  });
});