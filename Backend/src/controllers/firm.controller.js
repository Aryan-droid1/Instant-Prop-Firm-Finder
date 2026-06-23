const Firm = require('../models/firm.model');

async function createFirm(req, res) {
  try {
    const firm = await Firm.create(req.body);

    res.status(201).json({
      message: 'Firm created',
      firm
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
async function getAllFirms(req, res) {
  try {
    const firms = await Firm.find();

    res.status(200).json(firms);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
async function getFirmById(req, res) {
  try {
    const { id } = req.params;

    const firm = await Firm.findById(id);

    if (!firm) {
      return res.status(404).json({
        message: 'Firm not found'
      });
    }

    return res.status(200).json({
      firm
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
async function updateFirm(req, res) {
  try {
    const { id } = req.params;

    const updatedFirm = await Firm.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedFirm) {
      return res.status(404).json({
        message: 'Firm not found'
      });
    }

    return res.status(200).json({
      message: 'Firm updated successfully',
      firm: updatedFirm
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
async function deleteFirm(req, res){
  try {
    const { id } = req.params;

    const deletedFirm = await Firm.findByIdAndDelete(id);

    if (!deletedFirm) {
      return res.status(404).json({
        message: 'Firm not found'
      });
    }

    return res.status(200).json({
      message: 'Firm deleted successfully'
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
async function filterFirms(req, res) {
  try {
    const query = {};

    if (req.query.drawdownType) {
      query.drawdownType = req.query.drawdownType;
    }

    if (req.query.platform) {
      query.platform = req.query.platform;
    }

    if (req.query.country) {
      query.country = req.query.country;
    }

    if (req.query.profitSplit) {
      query.profitSplit = Number(req.query.profitSplit);
    }

    const firms = await Firm.find(query);

    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
async function searchFirms(req, res) {
  try {
    const query = {};

    if (req.query.name) {
      query.name = {
        $regex: req.query.name,
        $options: 'i'
      };
    }

    const firms = await Firm.find(query);

    res.status(200).json(firms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
 async function compareFirms(req, res) {
  try {
    const query = {};

    if (req.query.profitSplit) {
      query.profitSplit    =Number(req.query.profitSplit);
    }

    if (req.query.drawdownType) {
      query.drawdownType = req.query.drawdownType;
    }

    const firms = await Firm.find(query)
      .select('name profitSplit drawdownType -_id');

    res.status(200).json(firms);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}
async function recommendFirms(req, res) {
  try {

    const filters = {};

    if (req.query.newsTrading) {
      filters.newsTrading =
        req.query.newsTrading === "true";
    }

    if (req.query.weekendHolding) {
      filters.weekendHolding =
        req.query.weekendHolding === "true";
    }

    if (req.query.drawdownType) {
      filters.drawdownType =
        req.query.drawdownType;
    }

    const firms = await Firm.find(filters);

    res.status(200).json(firms);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
}

module.exports = {
  createFirm , getAllFirms , getFirmById ,updateFirm , deleteFirm ,filterFirms ,searchFirms,compareFirms,recommendFirms
};