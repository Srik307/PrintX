const fs = require('fs');
const path = require('path');
const currentPath=(process.cwd()).replaceAll(path.sep,'/');
// Function to write log

function readOrd(date,x){
    return new Promise((r,rj)=>{
        var filePath;
        if(x==undefined){
        filePath = currentPath+'/bin/verifiedcache/'+date.trim()+'.txt';
        }
        else{
         filePath = currentPath+'/bin/orderscache/'+date.trim()+'.txt';
        }
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err){
            console.error('Error reading the file:', err);
            r(0);
          }
          console.log(data);
          r(data);
        });
    });
}


function order(ord,ordid,x){
    return new Promise(async(r,rj)=>{
        var logFilePath;
        if(x==undefined){
            logFilePath = currentPath+'/bin/orderscache/'+ordid.trim()+'.txt';
       }
        else{
            logFilePath = currentPath+'/bin/verifiedcache/'+ordid.trim()+'.txt'
          }
        console.log(logFilePath);
        // The 'a' flag stands for 'append', so it appends to the file instead of overwriting it
        fs.writeFile(logFilePath,JSON.stringify(ord), (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
                r();
            } else {
                r();
            }
        });
    });
}


function cacheunres(ord,ordid){
    return new Promise(async(r,rj)=>{
        var logFilePath;
            logFilePath = currentPath+'/bin/unresolvedord/'+ordid.trim()+'.txt';
        console.log(logFilePath);
        // The 'a' flag stands for 'append', so it appends to the file instead of overwriting it
        fs.writeFile(logFilePath,JSON.stringify(ord), (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
                r();
            } else {
                r();
            }
        });
    });
}


function logDone(ord,ordid){
    return new Promise(async(r,rj)=>{
        var logFilePath;
        logFilePath = currentPath+'/bin/DoneLog/'+ordid.trim()+'.txt';
        console.log(logFilePath);
        // The 'a' flag stands for 'append', so it appends to the file instead of overwriting it
        fs.writeFile(logFilePath,JSON.stringify(ord), (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
                r();
            } else {
                r();
            }
        });
    });
}


function getDoneLog(date,x){
    return new Promise((r,rj)=>{
        var filePath;
        filePath = currentPath+'/bin/DoneLog/'+date.trim()+'.txt';

        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err){
            console.error('Error reading the file:', err);
            r(0);
          }
          console.log(data);
          r(data);
        });
    });
}



async function deltemp(x){
    return new Promise((r,rj)=>{
    const folderPath=currentPath+x;
    fs.rm(folderPath, { recursive: true },((err)=>{
    console.log(`Folder '${folderPath}' successfully removed.`);
    r();
}));
    });
}

function deliveredcache(ord,ordid){
    return new Promise(async(r,rj)=>{
        var logFilePath;
        logFilePath = currentPath+'/bin/DeliveredCache/'+ordid.trim()+'.txt';
        console.log(logFilePath);
        // The 'a' flag stands for 'append', so it appends to the file instead of overwriting it
        fs.appendFile(logFilePath,JSON.stringify(ord), (err) => {
            if (err) {
                console.error("Error writing to log file:", err);
                r();
            } else {
                r();
            }
        });
    });
}

module.exports={
    ord:order,
    readOrd:readOrd,
    deltempfiles:deltemp,
    cacheunres:cacheunres,
    logDone:logDone,
    getDoneLog:getDoneLog,
    deliveredcache:deliveredcache
}

