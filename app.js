const express = require('express');
const app = express();
const {Page, Domain, db} = require('./models');
const morgan = require('morgan');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(morgan('dev'));

app.get(require('./server'));

app.use((err, req, res, next) => {
  res.status(err.status || 500).send(err.stack);
});

db.sync()
.then(function() {
  app.listen(3001);
  console.log('listening on port 3001');
})
.catch(err => console.error(err.stack));

module.exports = app;
