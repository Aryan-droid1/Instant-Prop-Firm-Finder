const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');
const {
  createFirmSchema,
  updateFirmSchema
} = require('../validations/firm.validation');

const validate = require('../middlewares/validate.middleware');
const {
  createFirm ,getAllFirms ,getFirmById ,updateFirm ,deleteFirm ,compareFirms,searchFirms, filterFirms,recommendFirms
} = require('../controllers/firm.controller');


router.post('/',authMiddleware, adminMiddleware,validate(createFirmSchema),createFirm);
router.get('/AllFirms', getAllFirms);
router.get('/filter',filterFirms);
router.get('/search',searchFirms);
router.get('/compare',compareFirms);
router.get('/recommend', recommendFirms);
router.get('/:id', getFirmById);
router.put(
  '/:id',
  authMiddleware,
  adminMiddleware,
  validate(updateFirmSchema),
  updateFirm
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteFirm);


module.exports = router;
