import express = require('express');
import bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const app = express();
var db: any;


class User {

    url:string = 'mongodb://localhost:27017';
    port:number = 3000;

    constructor() {

        MongoClient.connect(this.url, (error: any, client: any) => {

            if(error){
                console.log(`Error while connecting to mongodb ${error}`);
            }
            else{          
                console.log('connected');

                //Here the sample database test is used
                db = client.db('test');
            }
        });

    }


    startProcess() {

        console.log('Inside start process');

        app.use(function (req, res, next) {
            console.log(req.body);
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            next();
          });

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.listen(this.port, () => console.log(`App listening on port ${this.port}!`))

        //Method to get all the employees
        app.get('/getEmployees', this.getAllEmployees);

        //Method to get particular employee
        app.get('/getEmployee/:id', this.getEmployee);

        // Method to insert multiple employees
        app.post('/addEmployees', this.addEmployees);

        // Method to add a single employee
        app.post('/addEmployee', this.addEmployee);

        // Method to update employee details
        app.post('/updateEmployee', this.updateEmployee);

        //Method to delete the employee information
        app.delete('/deleteEmployee/:id', this.deleteEmployee);

    }

    getAllEmployees(req : express.Request, res: express.Response) {

        console.log(`Inside get all employees:: ${req}`);

        try{
            db.collection('employees').find({}).toArray((err :any, docs: any) => {

                if(err){
                    console.log(`Error while fetching the data`);
                }
                else{               
                    //console.log(docs);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(docs);
                }
            });
    

        }
        catch(ex){
            console.log(`Error while fetching all the employees ${ex}`);
        }
        

    };

    //to get employee details

    async getEmployee(req:express.Request, res:express.Response){

        console.log(`Inside get employee details ${JSON.stringify(req.params)}`);

        try{
            db.collection('employees').find({"emp_id": req.params.id}).toArray((err :any, docs: any) => {

                if(err){
                    console.log(`Error while fetching the data`);
                }
                else{               
                    //console.log(docs);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(docs);
                }
            });
    

        }
        catch(ex){
            console.log(`Error while fetching all the employees ${ex}`);
        }

    }

    //to save multiple employees information
    async addEmployees(req : express.Request, res: express.Response): Promise<any> {

        console.log(`Inside add user. Data received is ${JSON.stringify(req)}`);

        try{
            await db.collection('employees').insertMany(
                req.body
            );

        }
        catch(err) {
            console.log(`Error while inserting employees:: ${err}`);
            res.send('Error in server.Not able to add employees');

        }

        res.send('Successfully saved all the employee information');
    }


    //to add a single employee information
    async addEmployee(req : express.Request, res: express.Response): Promise<any> {

        console.log(`Inside add user for single user. Data received is ${JSON.stringify(req.body)}`);

            try{
                await db.collection('employees').insert([
                    req.body
                ]);
    
            }
            catch(err) {
                //for(let e in err)console.log(e);
                console.log(`Error while inserting user:: ${err}`);
                res.send('Error in server.Not able to add employee');
    
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('Successfully save the single employee information');
    }

    async updateEmployee(req : express.Request, res: express.Response): Promise<any> {

        console.log(`Inside update user for ${JSON.stringify(req.body)}`);
        delete req.body['_id'];

        try{
            await db.collection('employees').updateOne({"emp_id": req.body.emp_id}, {$set:req.body});
        }
        catch(ex){
            console.log(`Got exception dd ${ex}`);
            res.send('Error in server.Not able to update');
        }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('Update employee details successfully');
        
    }

    async deleteEmployee(req : express.Request, res: express.Response): Promise<any> {

        console.log(`Inside delete employee details ${req.params.id}`);

        try{
            await db.collection('employees').deleteOne({"emp_id": req.params.id});
        }
        catch(ex){
            console.log(`Error while deleting user ${ex}`);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('Error in server.Not able to delete');
        }
        res.send(`Deleted the user successfully`);
    }

}


const user1: User = new User();
user1.startProcess(); 



