import { JWTPayload } from "./jwt.types.ts"

declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload
        }
    }
}

export {}