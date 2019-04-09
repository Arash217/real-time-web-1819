const yup = require('yup');

const userSchema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().min(5).required()
});

module.exports = userSchema;