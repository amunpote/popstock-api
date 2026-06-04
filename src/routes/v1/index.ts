import express from "express";

import shopRoutes from "@routes/v1/shop.route.ts";

const router = express.Router();

router.use("/shop", shopRoutes);

export default router;
