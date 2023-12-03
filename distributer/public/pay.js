const tab=document.getElementById('tab');
var orders,date,fullOrd_details=[];
window.addEventListener('load',async()=>{
   date=localStorage.getItem('date');
   const uscre=localStorage.getItem('printX');
   if(uscre==null || uscre===''){
    window.location.replace("log.html");
   }
   response=await getIndOrd(1);
   console.log(response);
   response['ord'].forEach((el)=>{
    const obj={};
    obj['info']=response['users'].find(obj => obj['id']===el['id']);
    obj['ord']=el;
    fullOrd_details.push(obj);
   });
   addDatatoTable();
});
const pr=1.25;

function getIndOrd(x){
        return new Promise((res,rj)=>{
            fetch('/getIndOrd',{
                method:"POST",
                body:JSON.stringify({
                    'date':date.trim(),
                    'x':x
                    }),
                headers: {
                        'Content-Type': 'application/json'
                      }
            }).then((r)=>{
                return r.json();
        }).then((resr)=>{res(resr);})
    });
}

function addDatatoTable(){
    var a=1;
    var str=`<tr>
    <th>S.No</th>
    <th>Amount</th>
    <th>Ord Id</th>
    <th>Verify</th>
    <th>Phone</th>
    <th>name</th>
  </tr>`
    fullOrd_details.forEach((el)=>{
        console.log();
        str=str+`<tr>
        <td>${a}</td>
        <td class='ryt'>${el['ord']['pr']}</td>
        <td class='ryt'>${el['ord']['id']}</td>
        <td id='${el['ord']['id']}'><button class='red' onclick="paid('${el['ord']['id']}')">verify</button></td>
        <td>${el['info']['ph']}</td>
        <td>${el['info']['n']}</td>`
        a++;
    });
    tab.innerHTML=str;
}

var verified_orders=[];
var verified_ordersdetails=[];
function paid(id){
    const ind=verified_orders.findIndex(i=> i['id']===id);
    if(ind!=-1){
        verified_orders[ind]['pay']=true;
    }
    else{
    const obj=fullOrd_details.find(i=> i['ord']['id']===id);
    obj['ord']['pay']=true;
    verified_orders.push(obj['ord']);
    verified_ordersdetails.push(obj['info']);
    }
    document.getElementById(id).innerHTML=`<button style="color:white;background-color:green">Paid</button>
    <button class='red' style="margin-left:5%" onclick="change('${id}')">Change</button>`
     console.log(verified_orders,verified_ordersdetails);
}

function change(id){
    if(confirm('Do you really want to change this status!!')){
    const ind=verified_orders.findIndex(i=> i['id']===id);
    verified_orders[ind]['pay']=false;
    document.getElementById(id).innerHTML=`<button class='red' onclick="paid('${id}')">Not paid</button>`;
    console.log(verified_orders);}
    else{return;}
}

function done_verification(){
    if(verified_orders.length!=fullOrd_details.length){
        alert("Please Verify all the orders!!!!!!!");
        return;
    }
    var pg=0;var pr=0;
        fetch('/cachemod',{
            method:"POST",
            body:JSON.stringify({
                'date':date.trim(),
                'ord':verified_orders,
                'det':verified_ordersdetails
                }),
            headers: {
                    'Content-Type': 'application/json'
                  }
        }).then((r)=>{
            return r.text();}).then((r)=>{ 
                console.log(r);
    });
    verified_orders.forEach((i)=>{
        if(i['pay']==true){
        pg=pg+i['pg'];
        pr=pr+i['pr'];
        }
  });
  document.getElementById('summary').innerHTML=`
  <h3>Total No of Paid Order:&nbsp;<span class='grn'>${verified_orders.length}</span></h3>
  <h3>Total No of Amount Paid:&nbsp;<span class='grn'>${pr}</span></h3>
  <h3>Total No of Pages for paid orders:&nbsp;<span class='grn'>${pg}</span></h3>
  <h1>Labels are generated</h1>`;
}

