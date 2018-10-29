const list = require('./employeesList.json');
const MongoClient = require('mongodb').MongoClient;
var db;
const url = 'mongodb://localhost:27017';
const port = 3000;

    
    function startProcess(){

        console.log(`Inside add employees`);

        MongoClient.connect(url, (error, client) => {

            if(error){
                console.log(`Error while connecting to mongodb ${error}`);
            }
            else{          
                console.log('connected');
                //Here the sample database test is used
                db = client.db('test');
                db.collection('employees').insertMany(
                    list.employees
                ).then(() => {
                    console.log('Successfully saved all the employee information');
                    client.close();
                }).catch((err) => {
                console.log(`Error while inserting employees:: ${err}`);
                });
    
            }
    
            });
        };

startProcess();