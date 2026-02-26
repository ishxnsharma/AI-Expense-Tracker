const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
