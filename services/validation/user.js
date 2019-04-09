const yup = require('yup');

const userSchema = yup.object().shape({
    username: yup.string().trim().required(),
    password: yup.string().trim().min(5).required(),
});

module.exports = userSchema;
