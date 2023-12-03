const path = require('path');
const currentPath=(process.cwd()).replaceAll(path.sep,'/');
const logger=require(currentPath+'/putinfo.js');
const { initializeApp }=require("firebase/app");
const {arrayUnion,getFirestore,doc,getDoc, collection,getDocs,setDoc,updateDoc}=require("firebase/firestore");



const firebaseConfig1={
    apiKey: "AIzaSyAkIxUvFqfuY_QYryZ7nfGaitgLSV70phs",
    authDomain: "printx-manager.firebaseapp.com",
    projectId: "printx-manager",
    storageBucket: "printx-manager.appspot.com",
    messagingSenderId: "807992172425",
    appId: "1:807992172425:web:4622be01ea8dc624c70b58"
};


const emp=initializeApp(firebaseConfig1,'1');
const manager=getFirestore(emp);

function checkcredits(x,ps){
    return new Promise((r,rj)=>{
    const today=doc(manager, "emp", x.trim());
    getDoc(today).then((docSnap)=>{
        if (docSnap.exists()){
          if(docSnap.data()['ps']===ps.trim()){
            r("Login");
          }
        else {
          r("Wrong password");
        }
    }
    else{
        r("User Not Found!!");
    }
        }).catch((err)=>{
          r("Please check your Network Connection!!");
        });
    });
}


function getAllOrd(){
    return new Promise(async (r,rj)=>{
    const all= collection(manager, "panel");
    const arr={};
    const querySnapshot = await getDocs(all);
    querySnapshot.forEach((res)=>{
      arr[res.id]=res.data();
    });
    r(arr);
  });
  }


function getunres(date){
  return new Promise(async (r,rj)=>{
    const all= doc(manager, "orderByDate",date);
    getDoc(all).then(async(res)=>{
     await logger.cacheunres(res.data(),date);
     r(res.data());
    });
  });
}

function allDone(date,deldata){
  return new Promise(async (r,rj)=>{
    const all= doc(manager, "panel",date);
    updateDoc(all,{dis:'done'}).then(async(res)=>{
      await logger.deliveredcache(deldata,date);
     r();
    });
  });
}



module.exports={
    check:checkcredits,
    getPanel:getAllOrd,
    getunres:getunres,
    allDone:allDone
}
