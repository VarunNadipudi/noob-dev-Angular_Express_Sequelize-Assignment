const express = require('express');
const Sequelize = require('sequelize');
const dbconfig = require('../db.config');
const cors = require('cors');
const PORT = 8000;

const app = express();
app.use(express.json());
app.use(cors());

//creating a sequelize object with database parameters to connect to it
const sequelize = new Sequelize(dbconfig.DB, dbconfig.USER, dbconfig.PASSWORD, {
  host : dbconfig.HOST,
  dialect : dbconfig.dialect,
  pool : {
    max : dbconfig.pool.max,
    min : dbconfig.pool.min,
    acquire : dbconfig.pool.acquire,
    idle : dbconfig.pool.idle
  }
});

//defining the policy table
let policyTable = sequelize.define('policyTable',{
  policyNumber : {
    primaryKey : true,
    type : Sequelize.INTEGER
  },
  policyHolderName : Sequelize.STRING,
  policyAmount : Sequelize.INTEGER,
  emiAmount : Sequelize.INTEGER,
  nominee : Sequelize.STRING
},{
  timestamps : false,
  freezeTableName : true
});

// //creating the table 
// policyTable.sync().then( ()=>{
//   console.log("Table created successfully!");
// })
// .catch( (error)=>{
//   console.log(error);
// })
// .finally( ()=>{
//   sequelize.close();
// });


//display all policies

app.get('/getAllPolicies', (req,res)=>{
  //need to send all the policies details to the request from db using Sequelize
  policyTable.findAll({raw:true}).then( (data)=>{
    res.status(200).send(data);
  })
  .catch( (error)=>{
    res.status(400).send(error);
  });

});


//display policy by Id

app.get('/getPolicyById/:id', (req,res)=>{
  //need to send the policy data with given id from db to the request using Sequelize
  policyTable.findByPk(req.params.id).then( (data)=>{
    res.status(200).send(data.dataValues);
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

//insert policy

app.post('/insertPolicy', (req,res)=>{
  //inserting the body data into db using Sequelize
  policyTable.create({
    policyNumber : req.body.policyNumber,
    policyHolderName : req.body.policyHolderName,
    policyAmount : req.body.policyAmount,
    emiAmount : req.body.emiAmount,
    nominee : req.body.nominee
  })
  .then( ()=>{
    console.log("Policy Inserted successfully!");
    res.status(200).send("Policy Inserted successfully!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});

//update policy

app.put('/updatePolicy', (req,res)=>{
  //need to update the policy in Db using Sequelize update method
  policyTable.update(
    { policyHolderName : req.body.policyHolderName, policyAmount : req.body.policyAmount, emiAmount : req.body.emiAmount, nominee : req.body.nominee},
    { where : { policyNumber : req.body.policyNumber}}
  )
  .then( (data)=>{
    console.log("Number of policies updated are : "+data);
    res.status(200).send("Policy updated successfully!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});


//delete policy

app.delete('/deletePolicy/:id', (req,res)=>{
  //Delete the policy with id from DB using Sequelize
  console.log(req.params.id);
  policyTable.destroy({
    where : { policyNumber : req.params.id}
  })
  .then( (data)=>{
    console.log("Number of policies deleted are : "+data);
    res.status(200).send("Policy will be deleted!");
  })
  .catch( (error)=>{
    console.log(error);
    res.status(400).send(error);
  });

});



app.listen(PORT, ()=>{
  console.log(`Server is running at port ${PORT}`);
});