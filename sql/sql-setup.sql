DROP TABLE IF EXISTS recipes CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS events_recipes;

CREATE TABLE events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(255),
  date DATETIME,
  attendees VARCHAR(255)
);

CREATE TABLE recipes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ingredients VARCHAR(255),
  instructions VARCHAR(255)
);

CREATE TABLE events_recipes (
  recipe_id BIGINT REFERENCES recipes(id),
  event_id BIGINT REFERENCES events(id),
  PRIMARY KEY(recipe_id, event_id)
);