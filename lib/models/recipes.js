const pool = require('../utils/pool.js');

module.exports = class Recipe {
    id;
    ingredients;
    instructions;

    constructor(row) {
      this.id = row.id;
      this.ingredients = row.ingredients;
      this.instructions = row.ingredients;
    }

    static async insert({ ingredients = [], instructions = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO recipes (ingredients, instructions) VALUES ($1, $2) RETURNING *',
        [ingredients, instructions]
      );

      await pool.query(
        `INSERT INTO recipes_events(recipes_id, events_id)
          SELECT ${rows[0].id}, id FROM tags WHERE title = ANY($1::ingredients[])`,
        [events]
      );
      
      return new Recipe(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT
                recipes.*
                array_agg(events.title) AS events
            FROM
                recipes_events
            JOIN recipes
            ON recipes_events.recipe_id = events.id
            JOIN events
            ON recipes_events.event_id = events.id
            WHERE recipes.id=$1
            GROUP BY events.id`,
        [id]
      );

      if(!rows[0]) throw new Error('No recipe was found for id ${id}');

      return {
        ...new Recipe(rows[0]),
        events: rows[0].events
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM recipes');

      return rows.map(row => new Recipe(row));

    }

    static async update(id, { ingredients, instructions }) {
      const { rows } = await pool.query(
        `UPDATE tweets 
            SET ingredients=$1,
                instructions=$2
            WHERE id=$3
            RETURNING *
        `,
        [ingredients, instructions, id]
      );
      return new Recipe(rows[0]);

    }
};
