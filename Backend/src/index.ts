import express, {Request, Response, NextFunction } from 'express'
import path from 'path'
import mysql, {RowDataPacket} from 'mysql2/promise';
import https from 'https';
import fs from 'fs';
import jwt, {JwtPayload} from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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

const SECRET_KEY = '62d6be3277e5bdd1b73800f195bc4a67500088b638109f7323123a420f1a3433';
const allowedOrigins = ['https://localhost', 'https://www.xn--rhy.tw'];

interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload; // 用戶資料存放於 req.user
}

const authenticate = async (req: AuthenticatedRequest, res: Response, next:NextFunction) => {
    const token = req.cookies.authToken;

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        req.user = jwt.verify(token, SECRET_KEY); // 將用戶資料存入請求物件
        const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ?', [(req.user as JwtPayload).username]);
        if (queries.length === 0) {
            res.sendStatus(403).json({ message: 'Token 無效' });
            return;
        }
        next(); // 繼續處理
    } catch (err) {
        res.sendStatus(403).json({ message: 'Token 無效或已過期' });
        return;
    }
};

function SetNewAuthTokenInCookie(username: string, response: Response) {
    // 生成 JWT
    const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });

    // 設置到 Cookie
    response.cookie('authToken', token, {
        httpOnly: true,
        secure: true,    // HTTPS 時設置為 true
        sameSite: 'strict',
        maxAge: 3600000   // 1 小時
    })
}

APP.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // 允許訪問
        } else {
            console.log('拒絕訪問：', origin);
            callback(new Error('不允許的來源')); // 拒絕訪問
        }
    },
    credentials: true // 允許攜帶憑證（如 Cookie）
}));
APP.use(express.json())
APP.use(cookieParser());


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
    if (queries.length != 1) {
        response.sendStatus(401);
        return;
    }
    SetNewAuthTokenInCookie(username, response);

    response.json({ success: true });
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

        SetNewAuthTokenInCookie(username, response);
        response.json({success: true})
    } else{
        response.json({success: false})
    }

})

APP.post('/api/auth', authenticate,async (req:AuthenticatedRequest, res) => {
    console.log(req.user);
    res.json({ isAuthenticated: true, user: req.user });
});

// 登出路由，清除 JWT Token
APP.post('/api/logout', (req: Request, res: Response) => {
    // 清除 Cookie 中的 authToken
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true,  // 如果是 HTTPS 設置為 true
        sameSite: 'strict', // 防止 CSRF 攻擊
    });

    // 回應登出成功
    res.json({ success: true, message: '登出成功' });
});

APP.post('/api/get/userINFO', authenticate, async (req:AuthenticatedRequest, res) => {
    const username = (req.user as JwtPayload).username;
    const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ?', [username]);
    res.json(queries[0]);
})


// APP.listen(80)

const options = {
    key: fs.readFileSync('./ssl/cloudflare-origin.key'),
    cert: fs.readFileSync('./ssl/cloudflare-origin.pem'),
};


// 啟動 HTTPS 伺服器
https.createServer(options, APP).listen(443);