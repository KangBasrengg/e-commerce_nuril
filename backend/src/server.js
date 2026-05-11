require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

// Function to start server
const startServer = async () => {
    try {
        // Attempt to connect to DB
        await sequelize.authenticate();
        console.log('✅ Database connected successfully.');

        // Sync models (in production, use migrations instead of sync({ force: true }))
        // For development, alter: true helps update schema without data loss (mostly)
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized.');

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        if (error.original) {
            console.error('Original Code:', error.original.code);
        }
        // We don't exit process so the dev can fix credentials without restarting script?
        // Actually better to exit in production, but for dev maybe retry?
        // For now, let's exit.
        process.exit(1);
    }
};

startServer();
