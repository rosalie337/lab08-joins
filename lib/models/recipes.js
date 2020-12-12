const pool = require('../utils/pool.js');
const events = require('./events.js');

module.exports = class Recipe {
    id;
    ingredients;
    instructions;

    constructor(row) {
      this.id = row.id;
      this.ingredients = row.ingredients;
      this.instructions = row.instructions;
    }

    static async insert({ ingredients, instructions, events = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO recipes (ingredients, instructions) VALUES ($1, $2) RETURNING *',
        [ingredients, instructions]
      );

      await pool.query(
        `INSERT INTO events_recipes(recipe_id, event_id)
          SELECT ${rows[0].id}, id FROM events WHERE title = ANY($1::text[])`,
        [events]
      );
      
      return new Recipe(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT
          recipes.*,
          array_agg(events.title) AS events
            FROM
            events_recipes
            JOIN recipes
            ON events_recipes.recipe_id = recipes.id
            JOIN events
            ON events_recipes.event_id = events.id
            WHERE recipes.id=$1
            GROUP BY recipes.id
            `,
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
        `UPDATE recipes
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
