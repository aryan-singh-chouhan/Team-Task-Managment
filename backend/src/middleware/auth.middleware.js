import { errorResponse } from '../utils/response.utils.js';
import { verifyToken } from '../utils/jwt.utils.js';

async function protect(req, res, next) {
	try {
		const token = req.cookies?.token;

		if (!token) {
			return errorResponse(res, 'Not authorized, no token', 401);
		}

		const decoded = verifyToken(token);

		if (!decoded) {
			return errorResponse(res, 'Not authorized, invalid token', 401);
		}

		req.user = decoded;
		return next();
	} catch (error) {
		return errorResponse(res, 'Not authorized, invalid token', 401);
	}
}

export {
	protect,
};
