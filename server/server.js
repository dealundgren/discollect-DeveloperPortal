const express =  require('express');
const bp = require('body-parser');
const cors = require('cors');

const dataRoutes = require('./dataRoutes.js');
const keyRoutes = require('./keyRoutes')

const app = express();

app.use(cors());
app.use(bp.json());
app.use(bp.urlencoded({ extended: false }));

app.use('/api', dataRoutes);
app.use('/key', keyRoutes);


app.use('/*', (req, res) => {
  res.send('you hit the wildcard!');
});

let port = process.env.PORT || 4005;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log('listening on port', port);
})
