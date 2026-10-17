import { Router } from 'express';
import { LoanController } from '../controllers/loan.controller';

const router = Router();

router.get('/search', LoanController.getLoansByFilter);
router.get('/:id', LoanController.getLoanById);

router.post('/', LoanController.createLoan);

router.put('/:id/accept', LoanController.acceptLoanInventory);


export default router;