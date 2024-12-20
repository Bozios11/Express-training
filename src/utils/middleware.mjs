

// MIDDLEWARE

const loggingMiddleware = (request, response, next) => {
    console.log(`${request.method} - ${request.url}`);
    next();
};

const resolveIndexByUserId = (request, response, next) => {
    const { params: { id } } = request;
    const parseId = parseInt(id);

    if (isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parseId);

    if (findUserIndex === -1) return response.sendStatus(404);

    request.findUserIndex = findUserIndex;  // Store the user index in the request object
    next();
};

export {loggingMiddleware,resolveIndexByUserId};