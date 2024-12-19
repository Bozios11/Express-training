import express from 'express';

const app = express();

app.use(express.json());

const mockusers = [
    {id: 1, username: "anson", displayName: "Ansos69"},
    {id: 2, username: "johndoe", displayName: "JohnD88"},
    {id: 3, username: "janedoe", displayName: "JaneDoe92"},
    {id: 4, username: "steve123", displayName: "Steve_42"},
    {id: 5, username: "michaelb", displayName: "MikeB_01"},
    {id: 6, username: "sarahconnor", displayName: "Sarah_C87"},
    {id: 7, username: "davidson", displayName: "David_1975"},
    {id: 8, username: "emilyjay", displayName: "Emily_Jay90"},
    {id: 9, username: "robertsmith", displayName: "Robert_Smith99"},
    {id: 10, username: "lindasmith", displayName: "Linda_Smith88"}
];

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running`);
});


app.get("/api/users", (request,response) => {
    console.log(request.query);
    const {query: {filter,value}} = request;
 
    if(filter && value) return response.send(
        mockusers.filter((user) => user[filter].includes(value))
    ); 

    return response.send(mockusers);
});

//POST

app.post('/api/users',(request,response) =>{
   console.log(request.body);
   const { body } = request;
   const newUser =  {id: mockusers[mockusers.length -1].id + 1,...body};
   mockusers.push(newUser);
    return response.status(201).send(newUser);
}); 

//PUT

app.put("/api/users/:id",(request,response) =>{
    const 
    {     body, 
          params: {id},
    } = request;

    const parseId = parseInt(id);

    if( isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parseId);

    if(findUserIndex === -1) return response.sendStatus(404);

    mockusers[findUserIndex] = {id: parseId, ...body};

    return response.sendStatus(200);
});

//Patch

app.patch("/api/users/:id",(request,response) =>{
    const 
    {     body, 
          params: {id},
    } = request;

    const parseId = parseInt(id);

    if( isNaN(parseId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parseId);

    if(findUserIndex === -1) return response.sendStatus(404);

    mockusers[findUserIndex] = { ...mockusers[findUserIndex], ...body};
    
    return response.sendStatus(200);
});

//Delete

app.delete("/api/users/:id", (request, response) => {
    const 
    { 
          params: {id},
    } = request;

    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.sendStatus(400);

    const findUserIndex = mockusers.findIndex((user) => user.id === parsedId);

    if(findUserIndex === -1) return response.sendStatus(404);

    mockusers.splice(findUserIndex,1);

    return response.sendStatus(200);
});