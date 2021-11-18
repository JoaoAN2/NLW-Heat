import { Router } from "express";
import { AuthenticateMessageController } from "./controllers/AuthenticateMessageController";
import { AuthenticateUserController } from "./controllers/AuthenticateUserController";
import { GetLast3MessagesController } from "./controllers/GetLast3MessagesController";
import { ProfileUserController } from "./controllers/ProfileUserController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

const router = Router();

router.post("/authenticate", new AuthenticateUserController().handle);
router.post("/messages", ensureAuthenticated, new AuthenticateMessageController().handle);
router.get("/messages/last3", new GetLast3MessagesController().handle);
router.get("/profile", ensureAuthenticated, new ProfileUserController().handle);

export { router }