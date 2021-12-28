import { Request, Response } from "express";
import { AuthenticateUserService } from "../services/AuthenticateUserService";

class AuthenticateUserController {
    async handle(request: Request, response: Response) {
        const { code, CLIENT_ID } = request.body;
        const service = new AuthenticateUserService();
        try {
            const result = await service.execute(code, CLIENT_ID);
            return response.json(result);
        } catch (err) {
            console.log({error: err.message})
            return response.json({error: err.message});
        }
    }
}

export { AuthenticateUserController }