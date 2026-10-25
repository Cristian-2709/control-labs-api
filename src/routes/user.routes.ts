import {Router} from 'express';
import {UserController} from '../controllers/user.controller';
import { validateUserPayload } from '../middlewares/validateUser.middleware';


const router = Router();

router.get('/', UserController.getUser);
router.post('/', validateUserPayload, UserController.createUser);
router.get('/:id', UserController.getUserById);
router.patch('/:id', validateUserPayload, UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;