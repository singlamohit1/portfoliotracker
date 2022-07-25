import express from "express";
import dotenv from "dotenv";
import { getReturns } from "../controllers/index.js";
dotenv.config();

const router = express.Router();

/**
 * @swagger
  get: {
    tags: ["Todo CRUD operations"], // operation's tag.
    description: "Get todos", // operation's desc.
    operationId: "getTodos", // unique operation id.
    parameters: [], // expected params.
    // expected responses
    responses: {
      // response code
      200: {
        description: "Todos were obtained", // response desc.
        content: {
          // content-type
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Todo", // Todo model
            },
          },
        },
      },
    },
  },
 */
router.get("/", async function (req, res) {
  try {
    let result = await getReturns();
    return res.status(200).json({
      "total returns": result,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export const cumulativeReturnsRouter = router;
