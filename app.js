const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

const sql = require('mysql');

const dataBase = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Ha22091984',
    database: 'hokihokijc12',
    port: '3306'
});

dataBase.connect( error => {
    if (error) console.log(error);
    console.log('Connected to mySql')
})

const port = 5000;

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: false } ));

app.get('/allusers', (req, res) => {
    dataBase.query('SELECT * FROM users', (error, result) => {
        console.log(error)
        console.log(result)
        if (error) res.status(500).send(error);
        return res.status(200).send(result);
    })
})

// app.get('/users', (req, res) => {
//     let sql = `SELECT * FROM users 
//                 WHERE username = '${req.query.username}' 
//                 AND password = '${req.query.password}'`
//     dataBase.query(sql, (error, result) => {
//         if (error) res.status(500).send(error);
//         return res.status(200).send(result[0])
//     })
// })

app.get('/users', (req, res) => {
    let sql = `SELECT * FROM users WHERE username = ? AND password = ?`
    const { username, password } = req.query
    dataBase.query(sql, [username, password], (error, result) => {
        if (error) res.status(500).send(error);
        return res.status(200).send(result[0])
    })
})

// app.post('/users', (req, res) => {
//     let sql = `INSERT INTO users (username, password)
//                 VALUES (
//                     '${req.body.username}',
//                     '${req.body.password}'
                    
//                 )`
//     dataBase.query(sql, (error, result) => {
//         if (error) res.status(500).send(error);
//         dataBase.query(`SELECT * FROM users`, (error, result) => {
//             if (error) res.status(500).send(error);
//             return res.status(200).send(result)
//         })
//     })
// })

app.post('/users', (req, res) => {
    if (req.body.username === '' || req.body.password === '') {
        return res.status(500).send('woy masukin datanya')
    }
    let sql = `INSERT INTO users set ?`;
    dataBase.query(sql, req.body, (error, result) => {
        if (error) res.status(500).send(error);
        dataBase.query(`SELECT * FROM users`, (error, result) => {
            if (error) res.status(500).send(error);
            return res.status(200).send(result)
        })
    })
})

app.put('/users/:id', (req, res) => {
    console.log(req.params, 'ini params');
    console.log(req.body, 'ini body');
    let sql = `update users set ? where id = ${req.params.id}`
    dataBase.query(sql, req.body, (error, result) => {
        if (error) return res.status(500).send(error)
        // return res.status(200).send(result)
        dataBase.query(`SELECT * FROM users`, (error, result) => {
            if (error) return res.status(500).send(error)
            return res.status(200).send(result)
        })
    })
})

app.delete('/users/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE id = ${req.params.id}`
    dataBase.query(sql, req.body, (error, result) => {
        if (error) return res.status(500).sendStatus(error)
        // return res.status(200).send(result)
        dataBase.query('SELECT * FROM users', (error, result) => {
            if (error) return res.status(500).send(error);
            return res.status(200).send(result)
        })
    })
})

app.listen(port, () => console.log(`Server run in port ${port}`))

