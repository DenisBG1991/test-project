'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const departments = require('./db/departments');
const employees = require('./db/employees');

const app = express();

app['set']('port', (process.env.PORT || 5000));

app['use'](express['static'](path.join(__dirname, 'public')));
app['use'](bodyParser['json']());
app['use'](bodyParser['urlencoded']({ extended: true }));

app['use']((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app['get']('/db/departments', (req, res) => {
    res.send(departments);
});

app['get']('/db/employees', (req, res) => {
    res.send(employees);
});

app['delete']('/db/employees/:id', (req, res) => {
    const index = employees['findIndex'](todo => todo['id'] == req['params']['id']);

    if (index === -1) return res['sendStatus'](404);

    employees['splice'](index, 1);

    res['sendStatus'](204);
});

app['get']('*', (req, res) => {
    fs.readFile(`${__dirname}/public/index.html`, (error, html) => {
        if (error) throw error;

        res.setHeader('Content-Type', 'text/html');
        res.end(html);
    });
});

app['listen'](app['get']('port'), () => console.log(`Server is listening: http://localhost:${app['get']('port')}`));