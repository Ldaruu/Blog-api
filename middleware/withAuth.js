const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	try {
		// const token = req.headers.authorization.split(' ')[1];
		const cookie = req.signedCookies.auth_token;
		const decoded = jwt.verify(cookie, process.env.SECRET_KEY);
		req.userData = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Auth failed' });
	}
};
