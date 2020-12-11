const app = require('./app.js');

const PORT = process.env.PORT || 7890;

app.listen(PORT, () => {
  console.log('The FEDS are listening on port ${PORT}');
});
