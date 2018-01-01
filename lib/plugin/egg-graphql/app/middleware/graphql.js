module.exports = options => {
    return async function ssr(ctx, next) {
        await next();
        const { url } = ctx.request
        // let ret = await ctx.service.ssr.render(url)
        ctx.body = 'test' || 'failed';
    };
};
