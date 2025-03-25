const express = require("express");
const { getLogin, postRedirect, getAllUsers, signupUser, loginUser, logoutUser, forgotPassword, renderResetPassword, resetPassword,
    googleAuth, googleAuthCallback } = require("../controller/userController");
const { addIncome, addExpense, addCategory, deleteCategory, getMainPage } = require('../controller/mainpageController');
const { monthlySpending, categoryRatio } = require('../controller/chartController');
const db = require('../config/db');

const router = express.Router();

router.get("/", getLogin);
router.post("/", postRedirect);

router.get('/users', getAllUsers);
router.post('/users/signup', signupUser);
router.post('/users/login', loginUser);
router.post('/users/logout', logoutUser);

router.get('/users/forgotPassword', renderResetPassword);
router.post('/users/forgotPassword', forgotPassword);

router.post('/users/reset', resetPassword);

router.get('/auth/google', googleAuth);
router.get('/auth/google/callback', googleAuthCallback);

// Ana sayfa route'u
router.get('/mainpage', (req, res) => {
    getMainPage(req, res);
});

// Gelir ekleme route'u
router.post('/add-income', (req, res) => {
    addIncome(req, res);
    res.redirect('/mainpage');
});

// Gider ekleme route'u
router.post('/add-expense', (req, res) => {
    // const { amount, category } = req.body;
    addExpense(req, res);
    res.redirect('/mainpage');
});

// Yeni kategori ekleme route'u
router.post('/add-category', (req, res) => {
    addCategory(req, res);
    res.redirect('/mainpage');
});

// Kategori silme route'u
router.post('/delete-category', (req, res) => {
    deleteCategory(req, res);
    res.redirect('/mainpage');
});

router.get('/dailyChart/:month', async (req, res) => {
    monthlySpending(req, res);
});

router.get('/categoryChart/:month', async (req, res) => {
    categoryRatio(req, res);
});

module.exports = router;