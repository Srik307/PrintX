const express = require('express');
const app = express();
const port = 3000; // Change this to the desired port number
const path = require('path');
const empmanager = require('./empmanager');
const currentPath=(process.cwd()).replaceAll(path.sep,'/');
const logger=require(currentPath+'/putinfo.js');
const db=require(currentPath+'/db.js');
const manage=require(currentPath+'/empmanager.js');
const ivp=require(currentPath+'/ivp.js');
const lab=require(currentPath+'/label.js');
app.use(express.static('public'));
// Middleware to parse JSON body for POST and PUT requests
app.use(express.json());

// GET request
app.get('/orders',async (req, res) => {
  const data=await manage.getPanel();
  res.json({'ord':data});
});


app.post('/log',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  const pg=await manage.check(req['usn'],req['ps']);
  res.send(pg+"");
});


app.post('/getDoneLog',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  const data=await logger.getDoneLog(req['date']);
  res.json(JSON.parse(data));
});

app.post('/logDone',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  await logger.logDone(req['done'],req['date']);
  res.send('logDone');
});



app.post('/getIndOrd',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  if(req['x']!=undefined){
    await logger.deltempfiles('/bin/orderscache/'+req['date']+'.txt');
  }
  const data=await db.order(req['date'],req['x']);
  res.json(data);
});

app.get('/ivp',async(rep,res)=>{
  const i= await ivp.ivp();
  res.send("http://"+i+":"+port);
})

app.post('/cachemod',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  const st=await db.cachemod(req['date'],req['ord']);
  console.log(req['ord']);
  lab.label(req['det'],req['ord'],req['date']);
  res.send(st);
});


app.post('/unresolved',async(requ,res)=>{
  const req = requ.body;
  const unres=await empmanager.getunres(req['date']);
  res.json(unres);
});

app.post('/alldone',async(requ,res)=>{
  const req = requ.body;
  const unres=await empmanager.allDone(req['date'],req['delord']);
  res.json(unres);
});

app.post('/getIndOrd',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  if(req['x']!=undefined){
    await logger.deltempfiles('/bin/orderscache/'+req['date']+'.txt');
  }
  const data=await db.order(req['date'],req['x']);
  res.json(data);
});

app.post('/verifiedord',async (requ, res) => {
  const req = requ.body;
  console.log(req['date']);
  const verified_ord=await logger.readOrd(req['date'],undefined);
  res.json(JSON.parse(verified_ord));
});






// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
