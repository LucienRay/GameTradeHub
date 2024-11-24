import express from 'express'
import path from 'path'
import mysql, {QueryResult, RowDataPacket} from 'mysql2/promise';

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


    const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM USER WHERE username = ? AND password = ?', [pool.escape(username), pool.escape(password)]);

    if(queries.length === 1) {
        response.json({success: true})
    } else {
        response.json({success: false})
    }
})

APP.listen(80)


