const db = require('../config/db');

// Yeni budget kaydı ekleme
const createBudgetRecord = async (data) => {
    const query = `INSERT INTO budget (user_id, income) VALUES (?, ?)`;
    const [result] = await db.execute(query, [data.user_id, data.income]);
    return result;
};

// Yeni kategori kaydı ekleme
const createCategoryRecord = async (data) => {
    const query = `INSERT INTO categories (budget_id, name, amount) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [data.budget_id, data.name, data.amount]);
    return result;
};

// Kategoriyi güncelleme
const updateCategoryRecord = async (budgetId, name, amount) => {
    const query = `UPDATE categories SET amount = ? WHERE budget_id = ? AND name = ?`;
    const [result] = await db.execute(query, [amount,budgetId, name]);
    return result;
};

// Kategori silme
const deleteCategoryRecord = async (budgetId, categoryName) => {
    const query = `DELETE FROM categories WHERE budget_id = ? AND name = ?`;
    const [result] = await db.execute(query, [budgetId, categoryName]);
    return result;
};

// Gelir ve gider güncelleme
const updateBudgetRecord = async (userId, income) => {
    const query = `UPDATE budget SET income = ? WHERE user_id = ?`;
    const [result] = await db.execute(query, [income, userId]);
    return result;
};

// getSummary - Kullanıcıya ait sadece o günün bütçe ve kategori bilgilerini alır
const getSummary = async (userId) => {
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi (YYYY-MM-DD formatında)

    // O günün bütçe bilgilerini al
    const budgetQuery = `
        SELECT id AS budget_id, income 
        FROM budget
        WHERE user_id = ? AND DATE(created_at) = ?`;
    const [budgetRows] = await db.execute(budgetQuery, [userId, today]);

    // Eğer o günün bütçesi yoksa, işlem yapılmaz
    if (budgetRows.length === 0) {
        return {
        categories: [],
        income: 0,
        expense: 0,
        total: 0,
        };
    }

    const budgetId = budgetRows[0].budget_id;
    const totalIncome = budgetRows[0].income;

    // O günün kategorilerine ait giderleri al (budget_id'ye göre)
    const categoriesQuery = `
        SELECT name, amount 
        FROM categories 
        WHERE budget_id = ?`;
    const [categoryRows] = await db.execute(categoriesQuery, [budgetId]);

    // Kategorileri düzenle
    const categories = categoryRows.map(cat => ({
        name: cat.name,
        amount: parseFloat(cat.amount),
    }));

    // Total Expense Hesaplama
    const query = `
        SELECT SUM(amount) AS totalExpense 
        FROM categories 
        WHERE budget_id = ?`;

    const [rows] = await db.execute(query, [budgetId]);

    // Eğer bir sonuç dönerse, totalExpense değerini al, aksi halde 0 olarak ayarla
    const totalExpense = rows[0]?.totalExpense || 0;
    
    // Toplam geliri ve gideri hesapla
    const total = totalIncome - totalExpense;

    return {
        categories,
        income: parseInt(totalIncome),
        expense: parseInt(totalExpense),
        total: total,
    };
};

// createBudgetForUser - Kullanıcı için o gün yeni bir bütçe ve kategori oluşturur
const createBudgetForUser = async (userId, income = 0) => {
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi (YYYY-MM-DD formatında)
  
    // 1. O gün için bütçe var mı diye kontrol et
    const budgetQuery = `
      SELECT id 
      FROM budget 
      WHERE user_id = ? AND DATE(created_at) = ?`;
    const [budgetRows] = await db.execute(budgetQuery, [userId, today]);
  
    // Eğer o gün için bütçe varsa, işlem yapma
    if (budgetRows.length > 0) {
      return { message: 'Bugün için zaten bir bütçe kaydı mevcut.' };
    }
  
    // 2. O gün için bütçe kaydı oluştur
    const createBudgetQuery = `
      INSERT INTO budget (user_id, created_at, income) 
      VALUES (?, ?, ?)`;
    const [budgetResult] = await db.execute(createBudgetQuery, [userId, today, income]);
  
    const budgetId = budgetResult.insertId; // Yeni eklenen bütçenin ID'si
    console.log('budgetId:', budgetId);
    // 3. Yeni bütçe ID'sine bağlı kategorileri oluştur
    const categories = [
      { name: 'Housing', amount: 0 },
      { name: 'Utilities', amount: 0 },
      { name: 'Food & Groceries', amount: 0 },
      { name: 'Transportation', amount: 0 },
      { name: 'Entertainment', amount: 0 }
    ];
  
    const createCategoryQuery = `
      INSERT INTO categories (name, amount, budget_id) 
      VALUES (?, ?, ?)`;
  
    // Kategorileri sırayla ekle
    for (const category of categories) {
      await db.execute(createCategoryQuery, [category.name, category.amount, budgetId]);
    }
  
    return { message: 'Yeni bütçe ve kategoriler başarıyla oluşturuldu.' };
};

// Kullanıcının o günkü bütçesinin ID'sini döndüren fonksiyon
const getTodayBudgetIdForUser = async (userId) => {
    const today = new Date().toISOString().split('T')[0]; // Bugünün tarihi (YYYY-MM-DD formatında)
  
    const query = `
      SELECT id 
      FROM budget 
      WHERE user_id = ? AND DATE(created_at) = ?`;
  
    const [rows] = await db.execute(query, [userId, today]);
  
    // Eğer bir sonuç dönerse, id değerini döndür, aksi halde null döndür
    return rows.length > 0 ? rows[0].id : null;
};

module.exports = {
getTodayBudgetIdForUser,
createBudgetRecord,
createCategoryRecord,
updateCategoryRecord,
deleteCategoryRecord,
updateBudgetRecord,
getSummary,
createBudgetForUser
};
