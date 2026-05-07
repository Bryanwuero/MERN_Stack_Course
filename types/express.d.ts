import 'express'

declare global {
	namespace Express {
		interface Request {
			/** Set by `protect` in auth middleware after JWT verification */
			user?: { id: string } | null
		}
	}
}

export {}
