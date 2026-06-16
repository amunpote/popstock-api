import express from "express";

import * as ProxyController from "@controllers/proxy.controller.ts";

const router = express.Router();

router.post("/fetch", ProxyController.fetchProxy);

export default router;
