const express = require('express');
const Sequelize = require('sequelize');
const cors = require('cors');
const dbConfig = require('../db.config');
const PORT = 8001;


const app = express();
app.use(express.json());
app.use(cors());

//creating a sequelize object with the database parameters to connect to it
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host : dbConfig.HOST,
  dialect : dbConfig.dialect,
  pool : {
    max : dbConfig.pool.max,
    min : dbConfig.pool.min,
    acquire : dbConfig.pool.acquire,
    idle : dbConfig.pool.idle
  }
});

//defining the user table 
let users = sequelize.define('users', {
  userId : {
    primaryKey : true,
    type : Sequelize.INTEGER
  },
  userName : Sequelize.STRING,
  userEmail : Sequelize.STRING,
  password : Sequelize.STRING
}, {
  timestamps : false,
  freezeTableName : true
});


// //creating the table
// users.sync().then( ()=>{
//   console.log("Table created successfully!");
// })
// .catch( (error)=>{
//   console.log(error);
// })
// .finally( ()=>{
//   sequelize.close();
// });

app.post('/signup', (req,res)=>{

  //need to insert the incoming data into the database using Sequelize
  users.create({
    userId : req.body.id,
    userName : req.body.name,
    userEmail : req.body.email,
    password : req.body.password
  })
  .then( ()=>{
    console.log("User is inserted into the db successfully!");
    res.status(200).send("Sign up Successful!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

app.post('/login', (req,res)=>{
  //find the user in the database with the email and password using Sequelize
  users.findAll({raw:true}).then( (data)=>{

    var bFlag = false;
    for(var i=0;i<data.length;i++){
      if(data[i].userEmail == req.body.email && data[i].password == req.body.password){
        bFlag = true;
        break;
      }
    }

    if(bFlag == true){
      console.log("Valid User");
      res.status(200).send("valid user");
    }
    else{
      console.log("Invalid User");
      res.status(200).send("invalid user");
    }

  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

// app.get('/', (req,res)=>{
//   console.log("Hello to empty request");
//   res.send("Hello to the request '/' ");
// });

app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
});