const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_CODE = "ajshhuehAhsjdhjklda";
const {offer} = require("../models/offers");


const getUserByToken = (token)=> {
    return new Promise((resolve, reject)=> {
        if(token) {
            let userData
            try {
                userData = jwt.verify(token, SECRET_CODE);
                resolve(userData);
            } catch(err) {
                reject("Invalid Token!")
            }
        } else {
            reject("Token not found")
        }
    })
}
router.get('/api', async (req, res) => {
    try {
      const { page = 1, records = 100, attribute = 'offer_title', query = '' } = req.query;
  
      const regexQuery = new RegExp(query, 'i');
  
      const offers = await offer.find({ [attribute]: regexQuery })
        .sort({ offer_sort_order: 'asc' })
        .skip((page - 1) * records)
        .limit(records);
const hasMore = await offer.countDocuments({ [attribute]: regexQuery }) > page * records;
  
      res.status(200).json({
        page: parseInt(page),
        has_more: hasMore,
        offers: offers,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });
  router.post("/create", async(req,res)=> {
    //find the user
    getUserByToken(req.headers.authorization).then((user)=> {
        ///create a offer based on user
        offer.create({...req.body, username: user.username}).then((offer)=> {
            res.status(200).send(offer);
        }).catch((err)=> {
            res.status(400).send({message: err.message})
        })
        //res.status(200).send(user)
    }).catch((err)=> {
        res.status(400).send(err)
    })
});
router.put('/api/:offerId', (req, res) => {
    const offerId = req.params.offerId;
    const updatedOffer = req.body;
  
    // check if offerId is valid and updatedOffer is not empty
    // if not, return 400 Bad Request status
    if (!isValidOfferId(offerId) || !isValidOffer(updatedOffer)) {
      res.status(400).json({ error: 'Invalid offer data' });
      return;
    }
offer.updateOffer(offerId, updatedOffer)
      .then((updatedOffer) => {
        if (!updatedOffer) {
          res.status(404).json({ error: `Offer with ID ${offerId} not found` });
        } else {
          res.status(200).json(updatedOffer);
        }
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
router.delete("/api/:offerId", (req, res) => {
  const { offerId } = req.params.offerId;

  // Delete the offer with the specified ID from the database
  offer
    .deleteOne(offerId)
    .then(() => {
      res.status(204).json("deleted sucessfully"); // No content
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Failed to delete offer"); // Internal server error
    });
});

module.exports = router;