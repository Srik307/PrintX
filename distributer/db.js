const path = require('path');
const currentPath=(process.cwd()).replaceAll(path.sep,'/');
const logger=require(currentPath+'/putinfo.js');
const { initializeApp }=require("firebase/app");
const {getFirestore,doc,getDoc, collection,getDocs, setDoc}=require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyDZrfD2n19_UN8vbV13MsgZ7mgCqvJGZgI",
  authDomain: "midwayprintx.firebaseapp.com",
  projectId: "midwayprintx",
  storageBucket: "midwayprintx.appspot.com",
  messagingSenderId: "167337763792",
  appId: "1:167337763792:web:79949d5c6e08c5082a4fd5"
};

const firebaseConfig3 = {
  apiKey: "AIzaSyDrTP2lnqThtyLBrmlJDuanNQIyAazl35o",
  authDomain: "users-db-dbf93.firebaseapp.com",
  projectId: "users-db-dbf93",
  storageBucket: "users-db-dbf93.appspot.com",
  messagingSenderId: "487192438208",
  appId: "1:487192438208:web:cf522c42700398416f1425"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const app3 = initializeApp(firebaseConfig3,'3');
const db3 = getFirestore(app3);

function getOrd(date,x){
return new Promise(async(res,rej)=>{
if(x==undefined){
const r=await logger.readOrd(date,"orderscache");
if(r!=0){
  console.log("offline");
  res(JSON.parse(r));
}
}
else{
console.log("online");
const today = doc(db, "orders", date);
const userdetails= doc(db3,'users',date);
/*const arr=[
  { 'id': 'keertu', 'usn': 'keerthana', 'pr': 100,'pay':true,'pg':97,'oth':['ezhil'],'w':true},
  { 'id': 'hello', 'usn': 'ezhil', 'pr': 100,'pay':true,'pg':97,'oth':['ezhil'],'w':true},
  { 'id': 'ezhil', 'usn': 'srikanth', 'pr': 100,'pay':true,'pg':177,'oth':['ezhil',"Tony"],'w':true},
  { 'pr': 100, 'id': '110', 'usn': 'keerthana','w':false},
];

const arr=[{"oth":["STR"],"pay":false,"id":"EK1092473","pg":1,"pr":1},{"pay":false,"oth":["Giridhar"],"pg":121,"id":"EK5422568","pr":151},{"pay":true,"pg":8,"pr":10,"id":"EK7552515","oth":["Ezhil"]}];
await logger.ord(arr,date.trim());
res(arr);
}
*/
getDoc(today).then(async(docSnap)=>{
  
if (docSnap.exists()){
  getDoc(userdetails).then(async(docusers)=>{
  await logger.ord({ord:docSnap.data()['ord'],users:docusers.data()['userd']},date.trim());
  res({ord:docSnap.data()['ord'],users:docusers.data()['userd']});
  })
  
} 
else {
  // docSnap.data() will be undefined in this case
 // console.log("No such document!");
  rej("No such document!");
}
}).catch((err)=>{
  rej(err);
});
}

});
}



function cachemod(date,ver_orders){
  console.log(ver_orders);
  return new Promise(async(r,rj)=>{
  await logger.ord(ver_orders,date.trim(),"verified");
  const today = doc(db, "orders", date);
  setDoc(today,{ord:ver_orders}).then(()=>{
    r('1');
  });
});
}


//getAllOrd();


module.exports={
  order:getOrd,
  cachemod:cachemod
}
