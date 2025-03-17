const express = require('express');
const dealController = require('../controllers/dealController');

const router = express.Router();

//Param Middleware
//router.param('id', dealController.checkID);

//When Someone Wants ALL Deals
router
  .route('/')
  .get(dealController.getAllDeals)  // Show all deals
  .post(dealController.createDeal); // Add a new deal


//When Someone Wants ONE Deal
router
  .route('/:id')
  .get(dealController.getDeal)  // Show one deal by ID
  .patch(dealController.updateDeal)  // Update a deal
  .delete(dealController.deleteDeal); // Delete a deal

module.exports = router;