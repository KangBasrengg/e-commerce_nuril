let app;
try {
    app = require('../src/app');
} catch (error) {
    app = (req, res) => {
        res.status(500).json({ error: 'Failed to load app', message: error.message, stack: error.stack });
    };
}
module.exports = app;
