require('dotenv').config();
//process.env.NAME
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

const port = process.env.PORT || 3333;

function setNoCache(res) {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    res.setHeader('Expires', date.toUTCString());
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Cache-Control', 'public, no-cache');
}

function setLongTermCache(res) {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    res.setHeader('Expires', date.toUTCString());
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
}

app.use(
    express.static('public', {
        extensions: ['html'],
        setHeaders(res, path) {
            if (path.match(/sw\.js$/)) {
                // matches sw.js, register-sw.js
                res.setHeader('Service-Worker-Allowed', '/');
                setNoCache(res);
                return;
            }
            if (path.match(/\.html$/)) {
                // matches index.html
                setNoCache(res);
                return;
            }

            if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|json)$/)) {
                setLongTermCache(res);
            }
        },
    })
);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// enable cors
app.get(`/cors`, (req, res) => {
    res.setHeader(`Access-Control-Allow-Origin`, 'https://10.12.56.227');
    res.send('cors request');
});

app.options(`/cors`, (req, res) => {
    res.setHeader(`Access-Control-Allow-Origin`, 'https://10.12.56.227');
    res.setHeader(`Access-Control-Allow-Headers`, '*');
    res.sendStatus(204);
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

app.listen(port, () => {
    console.log('LISTENING ON PORT ' + port);
});
