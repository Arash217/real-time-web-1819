const compose = require('koa-compose');

/* Error middleware for routes */
const errorHandling = async (ctx, next) => {
    try {
        await next();
        if (ctx.status === 404) {
            await ctx.render('error', {
                errorMessage: 'Page not found'
            });
        }
    } catch (e) {
        let error = '';

        switch (e.status) {
            case 400:
            case 404:
                error = e;
                break;
            default:
                error = 'Something went wrong';
        }

        ctx.body = error;
    }
};

module.exports = compose([
    errorHandling
]);