module.exports = options => {
    return async function ssr(ctx, next) {
      await next();
  
      ctx.body = 'ssr';
    };
  };
  