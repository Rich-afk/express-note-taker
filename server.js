//requiring the things we need for the servers to work
const express = require('express');
const path = require('path');
const fs = require('fs');
//for generating random id
const { v4: uuidv4 } = require('uuid');

//saving express library, saving to app
const app = express();
//saving to port number to make more dynamic
const PORT = process.env.PORT || 3001;

//making public acceptable in all ports (sets index to homepage)
app.use(express.static('public'));

//middleware, builds the connection between routes, mostly post request
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//GET /notes should return the notes.html file.
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

//req is the request, which gives us information on who's calling
//res is the result, used to respond back to whoever calls back the route
app.get('/api/notes', (req, res) => {
  //tries to read in file
  //console.log('in the get routes');
  fs.readFile('./db/db.json', (err, result) => {
    //error handling
    if(err){
      console.log(err);
      //sends back result
    } else {
      res.send(result);
    }
  })
})


app.post('/api/notes', (req, res) => {
  //to hold previous db.json contents
  var list = [];
  //data is the inputted note
  var data = req.body;
  data.id = uuidv4();
  //reads in previous contents
  fs.readFile('./db/db.json', (err, result) => {
    //error handling
    if(err){
      console.log(err);
      //sends back result
    } else {
      list = JSON.parse(result);
      list.push(data);
      //we write onto the file everything + data
      fs.writeFile('./db/db.json', JSON.stringify(list), (err) => {
        if(err){
          console.log(err);
          //sending back data
        } else {
          res.json(data);
        }
      })
    }
  })
})

//get is building a star route to send back index.html when there are extra directories put at the end of the url
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
