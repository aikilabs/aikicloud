const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

app.get('', (req, res) => {

    console.log('request fron tenderly web3 action')

    res.send('tenderly actions! test.');

});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
