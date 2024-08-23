import { Router } from "express";

const route: Router = Router();

route.get("/", (req, res) => {
  res.send("Hello World");
});

export { route };
