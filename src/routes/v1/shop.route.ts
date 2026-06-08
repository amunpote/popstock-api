import express from "express";

import * as ShopController from "@controllers/shop.controller.ts";

const router = express.Router();

router.post("/create", ShopController.createShop);

export default router;
