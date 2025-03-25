const {getSummary, getTodayBudgetIdForUser,createCategoryRecord, updateCategoryRecord, deleteCategoryRecord, updateBudgetRecord } = require('../controller/mainpageCrud');


const getMainPage = async (req, res) => { //FİXME:: getSummary yi cruddan çağır
    const userId = req.session.userId;
    if (req.session.loggedIn) {
        const { categories, income, expense, total } = await getSummary(userId);
        res.render('mainpage', { categories, income, expense, total });
    } else {
        res.send("hata: giriş yapmadınız");
    }
};

// Gelir ekleme
const addIncome = async (req, res) => {
    const { incomeAmount } = req.body;
    const userId = req.session.userId;
    try {
      await updateBudgetRecord(userId, incomeAmount, 0);  // Geliri güncelle
    } catch (err) {
      console.log(err);
      res.send('Hata oluştu');
    }
  };

// Yeni kategori ekleme
const addCategory = async (req, res) => {
    const { newCategory } = req.body;
    const userId = req.session.userId;
    try {
      // Varsayalım ki mevcut bir budget_id'yi kullanıcıyla ilişkilendiriyoruz
      const userId = req.session.userId;
      const budgetId = await getTodayBudgetIdForUser(userId); // Bu, gerçek bir mantığa göre belirlenmeli
      await createCategoryRecord({budget_id: budgetId, name: newCategory, amount: 0 });
    } catch (err) {
      console.log(err);
      res.send('Hata oluştu');
    }
};

// Kategori güncelleme
const addExpense = async (req, res) => {
    const { category, amount } = req.body;
    // const userId = req.session.userId;
    const userId = req.session.userId;
    const budgetId = await getTodayBudgetIdForUser(userId); // Gerçek mantıkla belirlenmeli
    try {
      await updateCategoryRecord(budgetId, category, amount);
    } catch (err) {
      console.log(err);
      res.send('Hata oluştu');
    }
};

// Kategori silme
const deleteCategory = async (req, res) => {
    const { categoryName } = req.body;
    const userId = req.session.userId;
    const budgetId = await getTodayBudgetIdForUser(userId); // Gerçek mantıkla belirlenmeli
    try {
      await deleteCategoryRecord(budgetId, categoryName);
    } catch (err) {
      console.log(err);
      res.send('Hata oluştu');
    }
};

module.exports = {
    getMainPage,
    getSummary,
    addIncome,
    addExpense,
    addCategory,
    deleteCategory,
};
