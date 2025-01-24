// Import the local 'database' module for MongoDB connection.
const mongodb = require('../data/database');

// Import the 'ObjectId' class from the 'mongodb' module for handling MongoDB document IDs.
const { ObjectId } = require('mongodb');

/**
 * A recursive function to validate nested objects.
 * @param {object} obj - The object to validate.
 * @param {array} requiredFields - The list of required fields.
 * @returns {boolean} - True if all required fields are present, false otherwise.
 */
// Recursive code just inserted here
const validateFields = (obj, requiredFields) => {
    for (const field of requiredFields) {
        if (typeof field === 'string') {
            if (!obj.hasOwnProperty(field)) {
                return false;
            }
        } else if (typeof field === 'object') {
            const key = Object.keys(field)[0];
            if (!obj.hasOwnProperty(key) || !validateFields(obj[key], field[key])) {
                return false;
            }
        }
    }
    return true;
};

/**
 * @swagger
 * /places:
 *   get:
 *     summary: Retrieve all places
 *     responses:
 *       200:
 *         description: A list of places
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   location:
 *                     type: string
 *                   priority:
 *                     type: string
 *                   status:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   addedDate:
 *                     type: string
 */
const getAll = async (req, res) => {
    try {
        const places = await mongodb.getDatabase().collection('places').find().toArray();
        res.status(200).json(places);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /places/{id}:
 *   get:
 *     summary: Retrieve a place by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the place to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Place retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 addedDate:
 *                   type: string
 */
const getSingle = async (req, res) => {
    const placeId = new ObjectId(req.params.id);
    try {
        const place = await mongodb.getDatabase().collection('places').findOne({ _id: placeId });
        if (place) {
            res.status(200).json(place);
        } else {
            res.status(404).json('Place not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /places:
 *   post:
 *     summary: Create a new place
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               addedDate:
 *                 type: string
 *     responses:
 *       201:
 *         description: Place created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 addedDate:
 *                   type: string
 */
const createPlace = async (req, res) => {
    const requiredFields = [
        'title',
        'description',
        'location',
        'category',
        'priority',
        'status',
        'createdBy',
        'addedDate'
    ];

    if (!validateFields(req.body, requiredFields)) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await mongodb.getDatabase().collection('places').insertOne(req.body);
        res.status(201).json(response.ops[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /places/{id}:
 *   put:
 *     summary: Update a place by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the place to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               priority:
 *                 type: string
 *               status:
 *                 type: string
 *               createdBy:
 *                 type: string
 *               addedDate:
 *                 type: string
 *     responses:
 *       200:
 *         description: Place updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 location:
 *                   type: string
 *                 priority:
 *                   type: string
 *                 status:
 *                   type: string
 *                 createdBy:
 *                   type: string
 *                 addedDate:
 *                   type: string
 */
const updatePlace = async (req, res) => {
    const placeId = new ObjectId(req.params.id);
    try {
        const response = await mongodb.getDatabase().collection('places').updateOne({ _id: placeId }, { $set: req.body });
        if (response.matchedCount > 0) {
            res.status(200).json('Place updated');
        } else {
            res.status(404).json('Place not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /places/{id}:
 *   delete:
 *     summary: Delete a place by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the place to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Place deleted
 */
const deletePlace = async (req, res) => {
    const placeId = new ObjectId(req.params.id);

    try {
        const response = await mongodb.getDatabase().collection('places').deleteOne({ _id: placeId });
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json('Place not found');
        }
    } catch (error) {
        res.status(500).json(`Error: ${error.message}`);
    }
};

// Export the CRUD functions so they can be used in other parts of the application.
module.exports = {
    getAll,
    getSingle,
    createPlace,
    updatePlace,
    deletePlace,
};
