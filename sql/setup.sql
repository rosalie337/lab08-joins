DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS events_recipes;

CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT,
  date DATE,
  attendees TEXT
);

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ingredients TEXT,
  instructions TEXT
);

CREATE TABLE events_recipes (
  recipe_id BIGINT REFERENCES recipes(id),
  event_id BIGINT REFERENCES events(id),
  PRIMARY KEY(recipe_id, event_id)
);