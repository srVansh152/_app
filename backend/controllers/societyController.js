const Society = require('../models/Society');

// Create a new society
exports.createSociety = async (req, res) => {
  const {
    societyname,
    societyaddress,
    country,
    state,
    city,
    zipcode
  } = req.body;
  console.log(req.body)
  try {
    // Check if society with the same name already exists
    const existingSociety = await Society.findOne({ societyname });
    if (existingSociety) {
      return res.status(400).json({ message: 'Society with this name already exists' });
    }

    // Create and save new society with provided data
    const society = new Society({
      societyname,
      societyaddress,
      country,
      state,
      city,
      zipcode
    });
    
    await society.save();

    // Return the created society document
    res.status(201).json(society);
  } catch (error) {
    console.error('Error creating society:', error);
    res.status(500).json({ message: 'Failed to create society', error: error.message });
  }
};

// Read societies
exports.getSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch societies', error: error.message });
  }
};
