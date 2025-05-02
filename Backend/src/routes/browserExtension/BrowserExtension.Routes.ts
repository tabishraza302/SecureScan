import express from 'express';

import ScanningController from '../../controllers/scanning/Scanning.Controller';

const router = express.Router();
const scanningController = new ScanningController();


router.post('/scan/:domain', scanningController.ScanDomain);
router.get('/score/:domain', scanningController.GetScore);


export default router;
