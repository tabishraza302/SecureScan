import express from 'express';

import ScanningController from '../../controllers/scanning/Scanning.Controller';

const router = express.Router();
const scanningController = new ScanningController();


router.post('/scan/:domain', scanningController.ScanDomain);
router.get('/report/:domain', scanningController.GetFullReport);


export default router;
