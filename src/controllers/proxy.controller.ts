import type { Request, Response } from "express";

export const fetchProxy = (req: Request, res: Response) => {
  const { shop, sessionId } = req.body;

  return res.status(200).json({ message: "Fetch Controller" });
};
