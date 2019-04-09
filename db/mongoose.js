const mongoose = require('mongoose');
const { host, port, database, username, password } = require('../config/db');

mongoose.connect(`mongodb://${host}:${port}}/${database}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    user: username,
    pass: password,
    auth: { authSource: 'admin' },
});
