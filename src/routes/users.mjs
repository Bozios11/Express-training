import { Router } from "express";
import {query,validationResult,body,matchedData} from "express-validator";
import mockusers from "../utils/users.mjs"; 
import {loggingMiddleware,resolveIndexByUserId} from "../utils/middleware.mjs";

const userRouter = Router();

//routers and validation
userRouter.get("/api/users", query('filter').isString().notEmpty().isLength({min:3,max:10}), (request, response) => {
    console.log(request.headers.cookie);
    console.log(request.cookies);
    if(request.cookies.hello && request.cookies.hello === "helloworld") console.log("spoko");
    else console.log("zua aura :/");
    const result = validationResult(request);
    const { query: { filter, value } } = request;
    if (filter && value) {
        return response.send(mockusers.filter((user) => user[filter]?.includes(value)));
    }
    return response.send(mockusers);
});

// POST route to create a new user || validation 
userRouter.post('/api/users',
    body('username').notEmpty().withMessage("not empty").isLength({min: 5, max: 32}).withMessage("username must be between 5 and 32 characters").isString().withMessage("Must be string"), 
    body('displayName').notEmpty(),
    (request, response) => {
    const result =validationResult(request);
    if(!result.isEmpty()){
        return response.status(400).send({errors: result.array()});
    }

    const data = matchedData(request);
    console.log(data)
    const newUser = { id: mockusers[mockusers.length - 1].id + 1, ...data };
    mockusers.push(newUser);
    return response.status(201).send(newUser);
});

// PUT route to update an entire user by ID
userRouter.put("/api/users/:id", (request, response) => {
    const { body, params: { id } } = request;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return response.sendStatus(404);

    // Update the entire user object
    mockusers[findUserIndex] = { id: parseId, ...body };

    return response.status(200).send(mockusers[findUserIndex]);
});

// PATCH route to partially update a user by ID
userRouter.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
    const { body, findUserIndex } = request;

    if (Object.keys(body).length === 0) {
        return response.status(400).send({ message: "No data provided to update" });
    }

    // Merge the existing user with the new data from the body
    mockusers[findUserIndex] = { ...mockusers[findUserIndex], ...body };

    return response.status(200).send(mockusers[findUserIndex]);
});

// DELETE route to remove a user by ID
userRouter.delete("/api/users/:id", (request, response) => {
    const { params: { id } } = request;
    const parsedId = parseInt(id);

    if (isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parsedId);

    if (findUserIndex === -1) return response.sendStatus(404);

    // Remove the user from the array
    mockusers.splice(findUserIndex, 1);

    return response.sendStatus(200);
});

export default userRouter;

