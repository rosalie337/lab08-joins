const pool = require('../utils/pool.js');

module.exports = class Event{
    id;
    title;
    date;
    attendees;


    constructor(row) {
      this.id = row.id;
      this.title = row.title;
      this.date = row.date;
      this.attendees = row.attendees;
    }

    static async insert({ title, date, attendees }) {
      const { rows } = await pool.query(
        'INSERT INTO events (title, date, attendees) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [title, date, attendees]
      );

      return new Event(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT 
                events.*
                array_to_json(array_agg(recipes.*)) AS events
            FROM
                events
            JOIN recipes
            ON events.id = recipes.events.id
            WHERE events.id=$1
            GROUP BY events.id
            `,
        [id]
      );

      if(!rows[0]) throw new Error('No even with id ${id} found');

      return {
        ...new Event(rows[0]),
        recipes: rows[0].recipes.map(recipes => new Recipes(recipes))
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM events');
    
      return rows.map(row => new Event(row));
    }

    static async update(id, { title, date, attendees }) {
      const { rows } = await pool.query(
        `UPDATE events
                SET title=$1,
                    date=$2,
                    attendees=$4,
                WHERE id=$5
                RETURNING *`,
        [title, date, attendees, id]
      );
    
      if(!rows[0]) throw new Error('No even with id ${id} found');
      return new Event(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        'DELETE FROM events WHERE id=$1 RETURNING *',
        [id]
      );

      return new Event(rows[0]);
    }

};
