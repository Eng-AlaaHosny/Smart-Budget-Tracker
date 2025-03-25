const { readAllRecords, createRecord, readRecord, readRecordForGoogle, updateRecord, checkmails, updateRecordForReset } = require('../controller/crud');
const { createBudgetForUser } = require('../controller/mainpageCrud');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const axios = require('axios');

const getLogin = async (req, res) => {
    res.render("login", { message: "Welcome to your personal" });
};

const postRedirect = (req, res) => {
    res.redirect('/mainpage');
};

const getAllUsers = async (req, res) => {
    try {
        const users = await readAllRecords('users');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const signupUser = async (req, res) => {
    try {
        const { username, password, mail } = req.body;
        if (!username || !password || !mail) {
            return res.status(400).send('Username and password and mail are required.');
        }

        const result = await createRecord('users', req.body);
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send('Username and password are required.');
        }

        const user = await readRecord('users', username);

        if (user && user.password == password) {
            req.session.loggedIn = true;
            req.session.userId = user.id;
            createBudgetForUser(user.id);
            res.redirect("/mainpage");
        } else {
            res.render("login", { message: "Invalid password or user not exist" });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        req.session.loggedIn = false;
        res.redirect('/');
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { mail } = req.body;
        if (!mail) {
            return res.status(400).send('Email is required.');
        }

        const user = await checkmails('users', mail);

        if (!user) {
            return res.status(404).send('No user found with this email.');
        }

        const token = crypto.randomBytes(20).toString('hex');
        const resetLink = `http://localhost:3000/users/forgotPassword?token=${token}&mail=${mail}`;

        await updateRecordForReset('users', mail, token, Date.now() + 3600000);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'gamzekarasu943@gmail.com',
                pass: process.env.GOOGLE
            }
        });

        const mailOptions = {
            from: 'gamzekarasu943@gmail.com',
            to: mail,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Please click the following link to reset your password: ${resetLink}`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
            }
            res.status(200).send('Password reset email sent.');
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

const renderResetPassword = (req, res) => {
    res.render("resetPassword", { mail: req.query.mail, token: req.query.token });
};

const resetPassword = async (req, res) => {
    const { token, mail } = req.query;
    const { password, password2 } = req.body;
    if (password != password2) {
        return res.status(400).send('Password should match!.');
    }
    const user = await checkmails('users', mail);
    if (!user) {
        return res.status(404).send('No user found with this email.');
    }
    if (user.resetToken !== token || user.resetTokenExpiration < Date.now()) {
        return res.status(403).send('Invalid token.');
    }
    await updateRecord('users', user.username, password);
    res.render('login', { message: "Password reset successful" });
};

const googleAuth = (req, res) => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const REDIRECT_URI = process.env.REDIRECT_URI;

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile email&prompt=select_account`;
    res.redirect(url);
};

const googleAuthCallback = async (req, res) => {
    const CLIENT_ID = process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.CLIENT_SECRET;
    const REDIRECT_URI = process.env.REDIRECT_URI;
    const { code } = req.query;

    // req.session.loggedIn = true;
    // req.session.userId = user.id;
    // createBudgetForUser(user.id);
    try {
        const { data } = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code',
        });

        const accessToken = data.access_token;
        // Kullanıcı Bilgisi Alma
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const userResponse = userInfoResponse.data;
        const userInfo = {
            username: userResponse.name,
            mail: userResponse.email,
        };
        const user = await readRecordForGoogle('users', userInfo.mail);

        if (user) {
            req.session.loggedIn = true;
            req.session.userId = user.id;
            createBudgetForUser(user.id);
            console.log('User:', req.session.userId, "userID=", user.id);
        } else {
            const result = await createRecord('users', userInfo);
            req.session.loggedIn = true;
            req.session.userId = result.insertId;
            createBudgetForUser(result.insertId);
            console.log('User:', req.session.userId, "userID=", result.insertId);
        }
        res.redirect('/mainpage');
    } catch (error) {
        console.error('Error:', error.response);
        res.redirect('/');
    }
};

module.exports = {
    getLogin,
    postRedirect,
    getAllUsers,
    signupUser,
    loginUser,
    logoutUser,
    forgotPassword,
    renderResetPassword,
    resetPassword,
    googleAuth,
    googleAuthCallback
};
