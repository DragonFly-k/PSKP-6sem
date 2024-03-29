const express = require('express');
const  bodyParser = require("body-parser");
const  fs  =  require ("fs");
const jwt = require("jsonwebtoken");
const { checkUser, createUser,CheckById } = require('./service');
const cookieParser = require("cookie-parser");
const{ AddTokenToBlackList, tokenInBlackList } =require("./redisService.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/auth/register', (req, res) => {
        const rs = fs.createReadStream('registration.html');
        rs.pipe(res);
    })
    .post('/auth/register', async (req, res) => {
        const { username, password } = req.body;
        const userFromBd = await checkUser(username, password)
        if (!userFromBd) {
            await createUser(username, password);
            res.redirect('/auth/login');
        }else {
            res.status(400).send("User already exists");
        }
    })
    .get('/auth/login', (req, res) => {
        const rs = fs.createReadStream('login.html');
        rs.pipe(res);
    })
    .post('/auth/login', async  (req, res) => {
        const { username, password } = req.body;
        const user = await checkUser(username, password)
        if (user) {
            const refreshToken = jwt.sign({id: user.id},  process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
            const accessToken = jwt.sign({id: user.id },  process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
            res.cookie('refreshToken', refreshToken, { path: '/auth/',httpOnly: true, sameSite: "strict" });
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "strict", });
            res.redirect('/auth/resource');
        } else {
            res.redirect('/auth/login');
        }
    })
    .get(`/auth/refresh`, async (req, res, next) => {
        const { refreshToken, accessToken } = req.cookies;
        if (!refreshToken || !accessToken) 
            return res.status(401).send("Token not valid");
        if (!await tokenInBlackList(refreshToken)) {
            try {
                const decoded = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);  
                const { id } = decoded;
                const user = await CheckById(id);
                if (!user) {
                    return res.status(401).send('Refresh token invalid');
                } else {
                    await AddTokenToBlackList(refreshToken);
                    const newAccessToken = jwt.sign({ id: user.id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
                    const newRefreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "24h" });
                    res.cookie('accessToken', newAccessToken, { httpOnly: true, sameSite: "strict", });
                    res.cookie('refreshToken',newRefreshToken, { path: '/auth/' });
                    res.redirect('/auth/resource');
                }
            }
            catch (err){
                if (err instanceof jwt.JsonWebTokenError) {
                    return res.status(401).send('Invalid token');
                }
            }
        }
        else{
            return res.status(401).send('token in black list');
        }
    })
    .get('/auth/logout', async (req, res) => {
        const { refreshToken } = req.cookies;
        await AddTokenToBlackList(refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken', { path: '/auth/' });
        res.redirect('/auth/login');
    })
    .get('/auth/resource',async  (req, res, next) => {
        const { accessToken} = req.cookies;
        if ( !accessToken) 
        { return res.status(401).send("Unauthorithed");}
        else {
            try {
                const decoded =  await jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
                const { id } = decoded;
                const user = await CheckById(id);
                res.json('resource for '+ user.username)
            }
            catch (err) {
                if (err instanceof jwt.JsonWebTokenError) {
                    return res.status(401).send('Invalid token');
                }
            }
        }
    });

app.use((req, res, next) => {res.status(404).send('Not found');});
app.listen(3000, () => {console.log(`Server started at http://localhost:3000`);});