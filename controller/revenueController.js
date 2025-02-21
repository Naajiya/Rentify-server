const revenues = require("../modal/RevenueModal");
const products = require('../modal/adProductModal');
const users = require("../modal/userModal");



exports.getRevenueDetails = async (req, res) => {
    console.log('get revenue');

    try {
        const revenueData = await revenues.findOne(); // Adjust query as needed
        console.log(revenueData.grandTotal);

        const [totalProducts, totalCustomer] = await Promise.all([
            products.countDocuments(),
            users.countDocuments()
        ]);


        const response={
            revenueData,
            totalProducts,
            totalCustomer
        }

        res.status(200).json(response)

    } catch (err) {
        console.log(err)
    }
}


exports.addExpense = async (req, res) => {
    console.log('add expense and description');

    const { expenseCost, description } = req.body
    const cost = Number(expenseCost);

    try {
        let revenue = await revenues.findOne();

        if (!revenue) {
            revenue = new revenues({ expense: [] });
        }

        // Add new expense to the expense array
        revenue.expense.push({ expenseCost:cost, description });
        revenue.totalExpense+=cost   

        await revenue.save();

        res.status(200).json(revenue);
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}


exports.getIncome = async (req, res) => {
    console.log('get income');

    try {
        // Fetch a single revenue document
        const revenue = await revenues.findOne(); 

        if (!revenue) {
            return res.status(404).json({ error: 'Revenue data not found' });
        }

        const totalExpense = revenue?.totalExpense || 0; // Default to 0 if undefined
        const rentTotal = revenue?.grandTotal || 0; // Default to 0 if undefined

        const incomeOrLoss = rentTotal - totalExpense; // RentTotal should be revenue, not expense

        let msg;
        if (incomeOrLoss > 0) {
            msg = 'profit'; // Income is positive (profit)
        } else {
            msg = 'loss'; // Income is negative (loss)
        }

        res.status(200).json({ incomeOrLoss, msg });

    } catch (err) {
        console.error('Error fetching income:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// const revdetails = await revenues.find()
// const grandTotals = await revenues.find().select('grandTotal -_id');
// const menCategoryProducts = await revenues.find({ "products.category": "Women" }).select("products");

// const pros = await revenues.find().select("products");

// const totalRevenue = await revenues.aggregate([
//     { $group: { _id: null, total: { $sum: "$grandTotal" } } }
// ]);
