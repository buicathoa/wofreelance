// import userController from "../controllers/userController"
const router = require('express').Router()
const db = require("../../models");
const postsController = require("../../controllers/PostsController/posts.controller");
const authorize = require('../../middlewares/authorize');
const checkSecretKey = require('../../middlewares/checkSecretKey');
const portfolioController = require('../../controllers/PortfolioController/portfolio.controller');
const validateFileSize = require('../../middlewares/validateFileSize');

const multer = require('multer');

router.post("/create", authorize(['director', 'admin', 'user']), 
        portfolioController.createPortfolio
)

router.post("/get-all", authorize(['director', 'admin', 'user']), 
        portfolioController.getPortfolios
)

router.post("/delete", authorize(['director', 'admin', 'user']), 
        portfolioController.deletePortfolios
)

router.post("/update", authorize(['director', 'admin', 'user']), 
        portfolioController.updatePortfolio
)
module.exports = router