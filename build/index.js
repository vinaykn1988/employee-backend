"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require('mongodb').MongoClient;
const app = express();
var db;
class User {
    constructor() {
        this.url = 'mongodb://localhost:27017';
        this.port = 3000;
        MongoClient.connect(this.url, (error, client) => {
            if (error) {
                console.log(`Error while connecting to mongodb ${error}`);
            }
            else {
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
        app.listen(this.port, () => console.log(`App listening on port ${this.port}!`));
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
    getAllEmployees(req, res) {
        console.log(`Inside get all employees:: ${req}`);
        try {
            db.collection('employees').find({}).toArray((err, docs) => {
                if (err) {
                    console.log(`Error while fetching the data`);
                }
                else {
                    //console.log(docs);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.send(docs);
                }
            });
        }
        catch (ex) {
            console.log(`Error while fetching all the employees ${ex}`);
        }
    }
    ;
    //to get employee details
    getEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside get employee details ${JSON.stringify(req.params)}`);
            try {
                db.collection('employees').find({ "emp_id": req.params.id }).toArray((err, docs) => {
                    if (err) {
                        console.log(`Error while fetching the data`);
                    }
                    else {
                        //console.log(docs);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.send(docs);
                    }
                });
            }
            catch (ex) {
                console.log(`Error while fetching all the employees ${ex}`);
            }
        });
    }
    //to save multiple employees information
    addEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside add user. Data received is ${JSON.stringify(req)}`);
            try {
                yield db.collection('employees').insertMany(req.body);
            }
            catch (err) {
                console.log(`Error while inserting employees:: ${err}`);
                res.send('Error in server.Not able to add employees');
            }
            res.send('Successfully saved all the employee information');
        });
    }
    //to add a single employee information
    addEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside add user for single user. Data received is ${JSON.stringify(req.body)}`);
            try {
                yield db.collection('employees').insert([
                    req.body
                ]);
            }
            catch (err) {
                //for(let e in err)console.log(e);
                console.log(`Error while inserting user:: ${err}`);
                res.send('Error in server.Not able to add employee');
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('Successfully save the single employee information');
        });
    }
    updateEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside update user for ${JSON.stringify(req.body)}`);
            delete req.body['_id'];
            try {
                yield db.collection('employees').updateOne({ "emp_id": req.body.emp_id }, { $set: req.body });
            }
            catch (ex) {
                console.log(`Got exception dd ${ex}`);
                res.send('Error in server.Not able to update');
            }
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.send('Update employee details successfully');
        });
    }
    deleteEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Inside delete employee details ${req.params.id}`);
            try {
                yield db.collection('employees').deleteOne({ "emp_id": req.params.id });
            }
            catch (ex) {
                console.log(`Error while deleting user ${ex}`);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.send('Error in server.Not able to delete');
            }
            res.send(`Deleted the user successfully`);
        });
    }
}
const user1 = new User();
user1.startProcess();
