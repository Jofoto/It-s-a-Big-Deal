const express = require('express');
const dealController = require('../controllers/dealController');
const authController = require('../controllers/authController');

const router = express.Router();

//Param Middleware
//router.param('id', dealController.checkID);

router.route('/monthly-plan/:year').get(dealController.getMonthlyPlan);

//When Someone Wants ALL Deals
router
  .route('/')
  .get(authController.protect, dealController.getAllDeals)  // Show all deals + protect from users that are not logged in
  .post(dealController.createDeal); // Add a new deal


//When Someone Wants ONE Deal
router
  .route('/:id')
  .get(dealController.getDeal)  // Show one deal by ID
  .patch(dealController.updateDeal)  // Update a deal
  .delete(dealController.deleteDeal); // Delete a deal

module.exports = router;