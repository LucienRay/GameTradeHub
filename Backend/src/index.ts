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

    const [queries] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM users ' +
        'WHERE ID = ? OR ' +
        'Email = ? OR ' +
        'Phone = ? OR ' +
        'SSN = ?', [username, email, phone, ssn]);

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

APP.post('/api/auth/admin', authenticate,async (req:AuthenticatedRequest, res) => {
    console.log(req.user);
    const [queries] = await pool.execute<RowDataPacket[]>('SELECT Permission FROM users WHERE ID = ?', [(req.user as JwtPayload).username]);
    if (queries[0].Permission != 1) {
        res.sendStatus(403);
        return;
    }
    res.json({ isAdmin: true, user: req.user });
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

APP.post('/api/get/shoppingCart', authenticate, async (req: AuthenticatedRequest, res) => {
    const user = (req.user as JwtPayload).username;
    try {
        // 查詢 wish、items 和 images 表格的購物車相關資料
        const [queries] = await pool.execute<RowDataPacket[]>(
            `SELECT 
                i.ID AS id, 
                i.Title AS name, 
                i.Price AS price, 
                w.Quantity AS quantity, 
                img.path AS image, 
                i.Seller_ID AS seller 
             FROM wish AS w
             JOIN items AS i ON w.Item_ID = i.ID
             LEFT JOIN images AS img ON i.Image_ID = img.ID
             WHERE w.User_ID = ?;`,
            [user]
        );

        res.json(queries);
        console.log(queries);
    } catch (error) {
        console.error('Error fetching shopping cart details:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/update/shoppingCart', authenticate, async (req: AuthenticatedRequest, res) => {
    const { id, quantity } = req.body; // 從請求中取得 item ID 和更新後的數量
    const user = (req.user as JwtPayload).username; // 從認證 token 中取得 User_ID

    try {
        // 檢查數據的合法性
        if (!id || quantity == null || quantity < 0) {
            res.status(400).json({ message: 'Invalid item ID or quantity' });
        }

        // 更新 wish 表格中的數量
        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE wish 
             SET Quantity = ? 
             WHERE User_ID = ? AND Item_ID = ?;`,
            [quantity, user, id]
        );

        // 判斷是否有成功更新
        if (result.affectedRows > 0) {
            res.json({ message: 'Item quantity updated successfully' });
        } else {
            res.status(404).json({ message: 'Item not found in the shopping cart' });
        }
    } catch (error) {
        console.error('Error updating item quantity:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

APP.post('/api/delete/shoppingCart', authenticate, async (req: AuthenticatedRequest, res) => {
    const { id } = req.body; // 從請求中獲取要刪除的 Item_ID
    const user = (req.user as JwtPayload).username; // 從認證 token 中獲取 User_ID

    try {
        // 執行刪除語句
        const [result] = await pool.execute<ResultSetHeader>(
            `DELETE FROM wish 
             WHERE User_ID = ? AND Item_ID = ?;`,
            [user, id]
        );

        // 判斷是否有成功刪除
        if (result.affectedRows > 0) {
            res.json({ message: 'Item deleted successfully from the shopping cart' });
        } else {
            res.status(404).json({ message: 'Item not found in the shopping cart' });
        }
    } catch (error) {
        console.error('Error deleting item from shopping cart:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

APP.post('/api/get/tableData', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const { tableName } = req.body;

        // 檢查 tableName 是否為允許的資料表
        const allowedTables = ['coupons', 'games', 'images', 'items', 'messages', 'orders', 'users', 'wish'];
        if (!allowedTables.includes(tableName)) {
            res.status(400).send('Invalid table name');
            return;
        }

        // 動態查詢資料表內容
        const [queries] = await pool.query(`SELECT * FROM \`${tableName}\``);
        res.json(queries);
    } catch (error) {
        console.error('Error fetching table data:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.put('/api/:table/:id', authenticate, async (req, res) => {
    try {
        const { table, id } = req.params; // 獲取資料表名和主鍵 ID
        const data = req.body; // 獲取要更新的數據

        console.log(data);
        console.log(table);
        console.log(id);
        // 檢查資料表名稱是否合法
        const allowedTables = ['coupons', 'games', 'images', 'items', 'messages', 'orders', 'users', 'wish'];
        if (!allowedTables.includes(table)) {
            res.status(400).send('Invalid table name');
            return;
        }

        // 動態生成 SQL 語句，安全地更新數據
        const columns = Object.keys(data).map((key) => `\`${key}\` = ?`).join(', ');
        const values = Object.values(data);

        await pool.query(`UPDATE \`${table}\` SET ${columns} WHERE id = ?`, [...values, id]);
        res.send('更新成功');
    } catch (error) {
        console.error('更新失敗：', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/:table', authenticate, async (req, res) => {
    try {
        const { table } = req.params; // 獲取資料表名稱
        const data = req.body; // 獲取要新增的數據

        // 檢查資料表名稱是否合法
        const allowedTables = ['coupons', 'games', 'images', 'items', 'messages', 'orders', 'users', 'wish'];
        if (!allowedTables.includes(table)) {
            res.status(400).send('Invalid table name');
            return;
        }

        // 動態生成 SQL 語句，安全地插入數據
        const columns = Object.keys(data).map((key) => `\`${key}\``).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);

        await pool.query(`INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`, values);
        res.send('新增成功');
    } catch (error) {
        console.error('新增失敗：', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.delete('/api/:table/:id', authenticate, async (req, res) => {
    try {
        const { table, id } = req.params; // 獲取資料表名稱和 ID

        // 檢查資料表名稱是否合法
        const allowedTables = ['coupons', 'games', 'images', 'items', 'messages', 'orders', 'users', 'wish'];
        if (!allowedTables.includes(table)) {
            res.status(400).send('Invalid table name');
            return;
        }

        // 刪除資料
        await pool.query(`DELETE FROM \`${table}\` WHERE ID = ?`, [id]);
        res.send('刪除成功');
    } catch (error) {
        console.error('刪除失敗：', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/add/shoppingCart', authenticate, async (req: AuthenticatedRequest, res) => {
    const user = (req.user as JwtPayload).username;
    const {ID, Quantity} = req.body;
    try {
        const [queries] = await pool.execute<RowDataPacket[]>(
            'SELECT * FROM wish WHERE User_ID = ? AND Item_ID = ?', [user, ID]);


        if (queries.length === 0) {
            await pool.execute(
                'INSERT INTO wish (User_ID, Item_ID, Quantity) VALUES (?, ?, ?)',
                [user, ID, Quantity]
            )
        } else {
            await pool.execute(
                'UPDATE wish SET Quantity = Quantity + ? WHERE User_ID = ? AND Item_ID = ?',
                [Quantity, user, ID]
            )
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/get/coupons', authenticate, async (req: AuthenticatedRequest, res) => {
    try {
        const userId = (req.user as JwtPayload).username; // 從認證中獲取用戶 ID

        // 執行查詢，只返回當前用戶的有效優惠券
        const [queries] = await pool.execute<RowDataPacket[]>(
            `SELECT * 
             FROM coupons
             WHERE User_ID = ? 
             AND Start_Date <= NOW() 
             AND End_Date >= NOW()`,
            [userId]
        );

        // 將結果返回給前端
        res.json(queries);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).send('Internal Server Error');
    }
});

APP.post('/api/add/order', authenticate, async (req: AuthenticatedRequest, res) => {
    const userId = (req.user as JwtPayload).username; // 從認證中獲取用戶 ID
    const { items, coupon, totalPrice } = req.body;

    // 驗證請求數據
    if (!items || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: '購物車內容無效' });
        return;
    }

    if (!totalPrice || totalPrice <= 0) {
        res.status(400).json({ error: '訂單總金額無效' });
        return;
    }

    // 開啟資料庫連接
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 插入每個商品（如果多商品應循環插入）
        for (const item of items) {
            await connection.execute(
                `INSERT INTO orders (Date, State, Payment_Method, Payment_State, Coupon_ID, Item_ID, Quantity)
                 VALUES (NOW(), ?, ?, ?, ?, ?, ?)`,
                [
                    1, // 訂單狀態
                    '線上',
                    '待付款',
                    coupon || null,
                    item.id,
                    item.quantity
                ]
            );
        }

        // 清空該用戶的 `wish` 資料
        await connection.execute(
            `DELETE FROM wish WHERE User_ID = ?`,
            [userId]
        );

        // 提交交易
        await connection.commit();
        connection.release();

        res.json({ success: true});
    } catch (error) {
        console.error('Error creating order:', error);

        // 發生錯誤時回滾交易
        if (connection) {
            await connection.rollback();
            connection.release();
        }

        res.status(500).send('Internal Server Error');
    }
});



// APP.listen(80)

const options = {
    key: fs.readFileSync('./ssl/cloudflare-origin.key'),
    cert: fs.readFileSync('./ssl/cloudflare-origin.pem'),
};


// 啟動 HTTPS 伺服器
https.createServer(options, APP).listen(443);