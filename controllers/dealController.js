const Deal = require('../models/dealModel');

  exports.getAllDeals = async (req, res) => {
  
    try{
    const deals = await Deal.find();

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
        deal: '<Updated deal here...>'
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
