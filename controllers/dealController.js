const Deal = require('../models/dealModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

  exports.getAllDeals = catchAsync(async (req, res, next) => {
      //execute query
      const features = new APIFeatures(Deal.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

      const deals = await Deal.find(req.query);
      
      //send response
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        results: deals.length,
        data: {
          deals
        }
      });
});

exports.getDeal = catchAsync(async (req, res, next) => {
    const deal = await Deal.findById(req.params.id);
    //const id = req.params.id * 1;

    if(!deal){
      return next(new AppError('No deal found with that ID.', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        deal
      }
    });
});



exports.createDeal = catchAsync(async (req, res, next) => {
  const newDeal = await Deal.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { 
          deal: newDeal
        }
      });
  // try {
  
  //   } catch (err) {
  //     res.status(400).json({
  //       status: 'fail',
  //       message: 'Invalid data sent'
  //     })
  //   }
  });


exports.updateDeal = catchAsync(async (req, res, next) => {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if(!deal){
      return next(new AppError('No deal found with that ID.', 404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        deal  
    }
  });
});

exports.deleteDeal = catchAsync(async (req, res, next) => {
    const deal = await Deal.findByIdAndDelete(req.params.id);

    if(!deal){
      return next(new AppError('No deal found with that ID.', 404))
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
});

//admin (3) (later)
// exports.getDealStats = async (req, res) => {
//   try{
//     const stats = Deal.aggregate([
//       {
//       $match: {}
//       }
//     ])
//   } catch(err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// }

//admin (3a) -- num of deals for each day, by year and month
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;

    const plan = await Deal.aggregate([
      { 
        $unwind: '$startDates' 
      },
      {
      $match: {
        valid_from: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numDealStarts: { $sum: 1 },
          deals: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: { 
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ])
});