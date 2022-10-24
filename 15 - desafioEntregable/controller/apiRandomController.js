import { fork } from "child_process";
export const apiRandomController = {
  get: (req, res) => {
    try {
      res.status(200).render("pages/random");
    } catch (error) {
      res.status(500).send({ error });
    }
  },
  post: (req, res) => {
    try {
      const cant = req.query.cant || 100000;
      const random = fork("./src/utils/random.js");
      random.send({ message: "start", cant: cant });
      random.on("message", (obj) => {
        res.json(obj);
      });
    } catch (error) {
      res.status(500).send({ error });
    }
  },
};
