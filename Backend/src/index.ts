import express from 'express'
import path from 'path'
import mysql, {QueryResult, RowDataPacket} from 'mysql2/promise';
import https from 'https';
import fs from 'fs';

const APP = express()

// 建立連接池
const pool = mysql.createPool({
    host: 'localhost',
    user: 'user',
    password: '123456',
    database: 'main',
    waitForConnections: true, // 等待連接資源可用
    connectionLimit: 10,      // 最大連接數
    queueLimit: 0,            // 查詢排隊上限（0 表示無上限）
});

APP.use(express.json())

APP.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'www', 'index.html'))
})

APP.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'www', request.path))
})

APP.post('/api/login', async (request, response) => {
    console.log(request.body)
    const {username, password} = request.body


    const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ? AND Password = ?', [username, password]);

    console.log(queries)
    if (queries.length === 1) {
        response.json({success: true})
    } else {
        response.json({success: false})
    }
})

APP.post('/api/register', async (request, response) => {
    console.log(request.body)
    const {username, password, ssn, nickname, phone, email} = request.body

    const [query] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ?', [username])
    console.log(query)
    if(query.length===0){
        await pool.execute(
            'INSERT INTO users (ID, Password, SSN, Nickname, Phone, Email, Permission) VALUES (?, ?, ?, ?, ?, ?, 0)',
            [username, password, ssn, nickname, phone, email]
        )
        response.json({success: true})
    } else{
        response.json({success: false})
    }

})

// APP.listen(80)

const options = {
    key: fs.readFileSync('./ssl/cloudflare-origin.key'),
    cert: fs.readFileSync('./ssl/cloudflare-origin.pem'),
};


// 啟動 HTTPS 伺服器
https.createServer(options, APP).listen(443);