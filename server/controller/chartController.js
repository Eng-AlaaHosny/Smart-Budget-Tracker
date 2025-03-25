const db = require('../config/db');

// Aylık günlük harcamaları getir
const monthlySpending = async (req, res) => {
    const userId = req.session.userId; // Sabit kullanıcı ID
    const month = req.params.month; // Aralık ayı
    try {
        // Günlük harcamalar
        const [dailyRows] = await db.query(
            `
            SELECT DAY(b.created_at) AS day, SUM(c.amount) AS total_spent
            FROM budget b
            JOIN categories c ON b.id = c.budget_id
            WHERE b.user_id = ? AND MONTH(b.created_at) = ?
            GROUP BY DAY(b.created_at)
            ORDER BY day
            `,
            [userId, month]
        );

        const dailySpending = { spendingData: Array(31).fill(0) };
        dailyRows.forEach(row => {
            dailySpending.spendingData[row.day - 1] = parseFloat(row.total_spent);
        });
        res.json({ amounts: dailySpending });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
};

// Aylık kategori oranlarını getir
const categoryRatio = async (req, res) => {
    const userId = req.session.userId; // Sabit kullanıcı ID
    const month = req.params.month; // Aralık ayı
    try {
        // Kategori oranları
        const [categoryRows] = await db.query(
            `
            SELECT c.name AS category, SUM(c.amount) AS total_spent
            FROM budget b
            JOIN categories c ON b.id = c.budget_id
            WHERE b.user_id = ? AND MONTH(b.created_at) = ?
            GROUP BY c.name
            `,
            [userId, month]
        );

        const categoryRatio = categoryRows.map(row => ({
            category: row.category,
            totalSpent: parseFloat(row.total_spent),
        }));
        res.json({ amounts: categoryRatio });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
};

module.exports = {
    monthlySpending,
    categoryRatio
};