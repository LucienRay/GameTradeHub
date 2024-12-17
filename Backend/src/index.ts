import express, {Request, Response, NextFunction, request} from 'express'
import path from 'path'
import mysql, {ResultSetHeader, RowDataPacket} from 'mysql2/promise';
import https from 'https';
import fs from 'fs';
import jwt, {JwtPayload} from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import validator from 'validator';
import multer from 'multer';

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

// 設定圖片上傳存儲位置
const storage = multer.diskStorage({
    // 設定檔案上傳目錄
    destination: function (req, file, cb) {
        cb(null, 'images/');
    },
    // 自定義檔案名稱，保留副檔名
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // 取得副檔名
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + ext); // 新檔名
    },
});
const upload = multer({dest: 'images/', storage: storage });


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
        if (queries.length === 0 || (req.user as JwtPayload).ip !== req.headers['cf-connecting-ip']) {
            res.sendStatus(403);
            return;
        }
        next(); // 繼續處理
    } catch (err) {
        res.sendStatus(403);
        return;
    }
};

function SetNewAuthTokenInCookie(username: string, response: Response, request: Request) {
    // 生成 JWT
    const token = jwt.sign({ username: username , ip:request.headers['cf-connecting-ip']}, SECRET_KEY, { expiresIn: '1h' });

    // 設置到 Cookie
    response.cookie('authToken', token, {
        httpOnly: true,
        secure: true,    // HTTPS 時設置為 true
        sameSite: 'strict',
        maxAge: 3600000   // 1 小時
    })
}

function validatePassword(password:string):boolean {
    const rules = {minLength: 8,
                   minLowercase: 1,
                   minUppercase: 1,
                   minNumbers: 1,
                   minSymbols: 1, };
    return password.length<=20 && validator.isStrongPassword(password, rules);
}

function validateTaiwanID(id:string):boolean {
    // 檢查基本格式：1 個大寫英文字母 + 9 位數字
    const regex = /^[A-Z][1-2]\d{8}$/;
    if (!regex.test(id)) {
        return false; // 格式不符
    }

    // 英文字母對應數值 (轉換表)
    const letterValues = {
        A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34, J: 18, K: 19, L: 20,
        M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25, S: 26, T: 27, U: 28, V: 29, W: 30, X: 31,
        Y: 32, Z: 33,
    };

    // 取得字母數值
    const letter = id[0];
    const letterValue = letterValues[letter as keyof typeof letterValues];

    // 分解字母數值 (a1 和 a2)
    const a1 = Math.floor(letterValue / 10); // 十位數
    const a2 = letterValue % 10;            // 個位數

    // 取得後 9 位數字
    const digits = id.slice(1).split("").map(Number);

    // 計算公式 N
    const weights = [8, 7, 6, 5, 4, 3, 2, 1, 1]; // 加權值
    let sum = a1 + a2 * 9; // 字母對應加權計算
    for (let i = 0; i < digits.length; i++) {
        sum += digits[i] * weights[i];
    }

    // 檢查是否整除 10
    return sum % 10 === 0;
}

function validateTaiwanPhoneNumber(phoneNumber:string):boolean {
    // 檢查格式是否符合：09 開頭 + 8 位數字
    const regex = /^09\d{8}$/;
    return regex.test(phoneNumber);
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

APP.get('*', (req, res) => {
    if (req.path.includes('..') || decodeURIComponent(req.path).includes('..')) {
        res.status(403).send('Forbidden')
    }
    let filePath = '';

    if(req.path.includes('images/')) {
        filePath = path.join(__dirname, '..', req.path);
    } else{
        filePath = path.join(__dirname, 'www', req.path);
    }

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath)
    } else {
        res.sendFile(path.join(__dirname, 'www', 'index.html'))
    }
});

APP.post('/api/login', async (request, response) => {
    console.log(request.body)
    const {username, password} = request.body


    const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ? AND Password = ?', [username, password]);

    console.log(queries)
    if (queries.length != 1) {
        response.sendStatus(401);
        return;
    }
    SetNewAuthTokenInCookie(username, response, request);

    response.json({ success: true });
})

APP.post('/api/register', async (request, response) => {
    console.log(request.body)
    const {username, password, ssn, nickname, phone, email} = request.body

    const validationResults = {
        username: true,
        password: true,
        ssn: true,
        nickname: true,
        phone: true,
        email: true
    };

    const [queries] = await pool.execute<RowDataPacket[]>('SELECT * FROM users WHERE ID = ?', [username]);

    validationResults.username = username.length>=8 && username.length<=20 && queries.length === 0;
    validationResults.password = validatePassword(password);
    validationResults.ssn = validateTaiwanID(ssn);
    validationResults.nickname = nickname.length>0 && nickname.length<=20;
    validationResults.phone = validateTaiwanPhoneNumber(phone);
    validationResults.email = validator.isEmail(email);

    if (Object.values(validationResults).includes(false)) {
        response.status(400).json({
            success: false,
            validationResults: validationResults
        });
        return;
    }

    await pool.execute(
        'INSERT INTO users (ID, Password, SSN, Nickname, Phone, Email, Permission) VALUES (?, ?, ?, ?, ?, ?, 0)',
        [username, password, ssn, nickname, phone, email]
    )

    SetNewAuthTokenInCookie(username, response, request);
    response.json({success: true})

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
    const [queries] = await pool.execute<RowDataPacket[]>(
        'SELECT u.ID,u.SSN,u.Nickname,u.Phone,u.Email ' +
        ' FROM users u WHERE ID = ?', [username]);
    res.json(queries[0]);
})

APP.post('/api/get/GameINFO', async (req: AuthenticatedRequest, res) => {
    try {
        // 查詢遊戲資訊和圖片路徑
        const [queries] = await pool.execute<RowDataPacket[]>(
            'SELECT g.ID, g.Name, g.Platform, i.path AS Image\n' +
            'FROM games g\n' +
            'LEFT JOIN images i\n' +
            'ON g.Image_ID = i.ID;'
        );
        res.json(queries);
    } catch (error) {
        console.error('Error fetching game info:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/get/ItemINFO', async (req: AuthenticatedRequest, res) => {
    try {
        // 查詢遊戲資訊和圖片路徑
        const [queries] = await pool.execute<RowDataPacket[]>(
            'SELECT \n' +
            'items.Title, \n' +
            'items.Price, \n' +
            'items.Quantity, \n' +
            'items.Description, \n' +
            'items.Seller_ID, \n' +
            'items.Game_ID, \n' +
            'images.path \n' +
            'FROM items \n' +
            'LEFT JOIN images ON items.Image_ID = images.ID \n' +
            'WHERE items.ID = ?;',
            [req.body.ID]
        );
        res.json(queries[0]);
    } catch (error) {
        console.error('Error fetching game info:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/get/SimpleItemINFOs', async (req: AuthenticatedRequest, res) => {
    try {
        // 查詢遊戲資訊和圖片路徑
        const [queries] = await pool.execute<RowDataPacket[]>(
            'SELECT i.ID, i.title Name, i.Seller_ID Seller, i.Price, i.Quantity \n' +
            'FROM items i\n' +
            'WHERE Game_ID = ?;',
            [req.body.game]
        );
        res.json(queries);
    } catch (error) {
        console.error('Error fetching game info:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/get/Messages', authenticate, async (req: AuthenticatedRequest, res) => {
    const user = (req.user as JwtPayload).username;
    try {
        // 查詢與該用戶相關的消息記錄
        const [queries] = await pool.execute<RowDataPacket[]>(
            'SELECT * ' +
            'FROM messages ' +
            'WHERE Sender_ID = ? OR Receiver_ID = ? ' +
            'ORDER BY Sent_Time ASC;',
            [user, user]
        );

        const result: {[username: string]: {Time: Date, Context: string, mode: boolean}[]} = {}
        queries.forEach((query) => {
            const key = query.Sender_ID === user ? query.Receiver_ID : query.Sender_ID;
            const mode = query.Sender_ID === user;
            if (!result[key]) {
                result[key] = [];
            }
            result[key].push({
                    Time: query.Sent_Time,
                    Context: query.Context,
                    mode: mode
            });
        });

        res.json(result);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/listItem', upload.single('image'), authenticate, async (req:AuthenticatedRequest, res) => {
    const { name, price,quantity, description, game_id } = req.body;
    const image = req.file;
    const seller_id = (req.user as JwtPayload).username;
    try {
        const [imageResult] = await pool.execute<ResultSetHeader>(
            'INSERT INTO images (path) VALUES (?)',
            ['/' + image?.path]
        );

        const imageId = imageResult.insertId; // 正確取得 insertId

        // 2. 插入商品到 items 表
        await pool.execute(
            `INSERT INTO items 
            (Title, Price, Quantity, Description, Seller_ID, Game_ID, Image_ID) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, price, quantity, description, seller_id, game_id, imageId]
        );

        res.json({ success: true, message: '商品和圖片已成功接收！' });
    } catch (error) {
        console.error('資料插入失敗：', error);
        res.status(500).json({ success: false, message: '商品上架失敗，請稍後再試！' });
    }
});

// APP.listen(80)

const options = {
    key: fs.readFileSync('./ssl/cloudflare-origin.key'),
    cert: fs.readFileSync('./ssl/cloudflare-origin.pem'),
};


// 啟動 HTTPS 伺服器
https.createServer(options, APP).listen(443);