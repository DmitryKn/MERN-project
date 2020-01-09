const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const placesController = require("../controllers/places-controller");
const fileUpload = require("../middleware/file-upload");
const checkAuth = require("../middleware/check_auth");

//open resourse
router.get("/:pid", placesController.getPlaceById);
router.get("/user/:uid", placesController.getPlacesByUserId);

//protected by auth token
router.use(checkAuth); //middeware for checking authorization
router.post(
  "/",
  fileUpload.single("image"),
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address")
      .not()
      .isEmpty()
  ],
  placesController.createPlace
);

router.patch(
  "/:pid",
  [
    check("title")
      .not()
      .isEmpty(),
    check("description").isLength({ min: 5 })
  ],
  placesController.updatePlace
);

router.delete("/:pid", placesController.deletePlace);

module.exports = router;
