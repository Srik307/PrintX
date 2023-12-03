const tab=document.getElementById('tab');
var orders;
window.addEventListener('load',async()=>{
   const uscre=localStorage.getItem('printX');
   if(uscre==null || uscre===''){
    window.location.replace("log.html");
   }
   orders=await allOrders();
   addDatatoTable();
});
const pr=1.25;
function allOrders(){
    return new Promise((res,rj)=>{
    fetch('/orders')
    .then((res)=>{
        return res.json();}).then((r)=>{
            res(r['ord']);
    });
});
}

function addDatatoTable(){
    var a=1;
    var str=`<tr>
    <th>S.No</th>
    <th>Order Date</th>
    <th>Verify</th>
    <th>Unresolved</th>
    <th>Delivery</th>
  </tr>`
    Object.keys(orders).forEach((el)=>{
        str=str+`<tr>
        <td>${a}</td>
        <td>${el}</td>`;
        if(orders[el]['dis']=='done'){
            str=str+`<td class='grn'>Done</td>
            <td class='grn'>Done</td>
            <td class='grn'>Done</td>`
        }
        else{
            str=str+`
            <td><button class='red' onclick="paymentverify('${el}')">Payment verify</button></td>
            <td><button class='red' onclick="unres('${el}')">Unresolved</button></td>
            <td><button class='red' onclick="deli('${el}')">Delivery</button></td>
          </tr>`
        }
        a++;
    });
    tab.innerHTML=str;
}

function paymentverify(x){
    localStorage.setItem('date',x.trim());
    window.location.href="payment.html"
}
function unres(x){
  localStorage.setItem('date',x.trim());
  window.location.href="unresolved.html"
}
function deli(x){
  localStorage.setItem('date',x.trim());
  window.location.href="delivery.html"
}
