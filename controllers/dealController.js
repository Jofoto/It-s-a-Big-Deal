const Deal = require('../models/dealModel');
const APIFeatures = require('../utils/apiFeatures');

  exports.getAllDeals = async (req, res) => {
  
    try{
     
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
    }catch (err){
      res.status(404).json({
        status: 'fail',
        message: err
      });
    }
};

exports.getDeal = async (req, res) => {
  try{
    const deal = await Deal.findById(req.params.id);
    //const id = req.params.id * 1;
    res.status(200).json({
      status: 'success',
      data: {
        deal
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createDeal = async (req, res) => {
  
  try {
  const newDeal = await Deal.create(req.body);

    res.status(201).json({
        status: 'success',
        data: { 
          deal: newDeal
        }
      });
    } catch (err) {
      res.status(400).json({
        status: 'fail',
        message: 'Invalid data sent'
      })
    }
  } ;


exports.updateDeal = async (req, res) => {
  try{
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: 'success',
      data: {
        deal  
    }
  });
  }catch{
    res.status(400).json({
      status: 'fail',
      message: err
  })
 }
};

exports.deleteDeal = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

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
exports.getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
            status: 'fail',
            message: err
          });
  }
}