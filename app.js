require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT || 3000}`)
);
