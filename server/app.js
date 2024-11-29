const express = require('express')
const cors = require('cors')
const app = express()
const port = 5000
const { Sequelize, QueryTypes } = require('sequelize');

app.use(express.json())
app.use(cors())
const sequelize = new Sequelize('energy_database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql' /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
});

app.post('/login', async (req, res) => {
    const { user, password } = req.body
    if (!user || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }
    const result = await sequelize.query('SELECT * FROM user_db WHERE BINARY user = ?', {
        replacements: [user],
        type: QueryTypes.SELECT,
    })
    const storedPassword = result[0].password
    if(password !== storedPassword){
        return res.status(401).json({ error: 'Incorrect password' });
    }
    res.status(200).json({ message: 'Login successful', result})
})

app.listen(port, async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
  console.log(`Example app listening on port ${port} at http://localhost:${port}/`)
})