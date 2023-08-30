const { validateToken } = require('../services/authentication')

function checkForAuthenticationCookie(cookie) {

    return (req, res, next) => {
        console.log(req.cookies[cookie]);
        const tokenCookieValue = req.cookies[cookie];
        if (!tokenCookieValue) {
            console.log("Hello");
            return next();
        }
        try {
            const userPayload = validateToken(tokenCookieValue);
            console.log({ userPayload });
            req.user = userPayload;
        } catch (err) {
            console.log({ err })
        }
        return next();
    }
}

module.exports = { checkForAuthenticationCookie };