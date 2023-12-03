const tab=document.getElementById('tab');
var fullOrd_details=[],verified_ord;
window.addEventListener('load',async()=>{
   date=localStorage.getItem('date');
   const uscre=localStorage.getItem('printX');
   if(uscre==null || uscre===''){
    window.location.replace("log.html");
   }
   fullOrd_details=await getDelivery();
   console.log(fullOrd_details);
   addDatatoTable();
});
const delivered=[];

function getDelivery(x){
    return new Promise((res,rj)=>{
        fetch('/getDoneLog',{
            method:"POST",
            body:JSON.stringify({
                'date':date.trim(),
                }),
            headers: {
                    'Content-Type': 'application/json'
                  }
        }).then((r)=>{
            return r.json();
    }).then((resr)=>{res(resr);})
});
}

function getverified_ord(){
    return new Promise((res,rj)=>{
        fetch('/verifiedord',{
            method:"POST",
            body:JSON.stringify({
                'date':date.trim()
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
    var str=`<thead><tr>
    <th>S.No</th>
    <th>Id</th>
    <th>Msg</th>
    <th>Status</th>
    <th>Details</th>
  </tr></thead><tbody>`;
  fullOrd_details.forEach((el)=>{
    str=str+`
    <tr id='${el['ord']['id']}'>
    <td>${a}</td>
    <td>${el['ord']['id']}</td>
    <td><button  id='msg${el}' onclick="msg('${el['ord']['id']}')" class='btn btn-success'>Msg</button></td>
    <td><button  onclick="del('${el['ord']['id']}')" class='btn btn-success'>ND</button></td>
    <td><button  onclick="info('${el['ord']['id']}')" class='btn btn-success'>Info</button></td>
    </tr>`;
    a++;
});
    tab.innerHTML='</tbody>'+str;
}




function msg(id){
    const obj=fullOrd_details.find(i=> i['ord']['id']===id);
    const loc=document.getElementById('location').value;
    str=`MIDWAY PrintX\nYour Order with order id:${id} is ready get it now near ${loc}`;
    str=encodeURIComponent(str);
    const whatsapplink=`https://wa.me/91${obj['info']['ph']}?text=${str}`;
    window.open(whatsapplink, '_blank');
    document.getElementById('msg'+id).textContent='msged';
    document.getElementById('msg'+id).style.classname='btn btn-light';
}

function del(id){
    if(confirm('Is the order id: '+id+" , delivered successfully??")){
    document.getElementById(id).style.opacity='0.4';
    document.getElementById(id).style.pointerEvents='none';
    delivered.push(1);}
    else{
        return;
    }
}

function info(id,cl){
    const modal=document.getElementById('al');
    if(cl==undefined){
    const obj=fullOrd_details.find(i=> i['ord']['id']===id);
    console.log(obj);
    modal.innerHTML=`
 <ol class="list-group list-group mb-3 w-100">
 <li class="list-group-item"><h5 class='text-center'>Order Info</h5></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Order id:</span><span>${id}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Name</span><span>${obj['info']['n']}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Mob no:</span><span>${obj['info']['ph']}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Pages:</span><span>${obj['ord']['pg']}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Amt:</span><span>₹${obj['ord']['pr']}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Watermarks:</span><span>${obj['ord']['oth']}</span></div></li>
 <li class="list-group-item"><div class="d-flex bg-light"><span>Email:</span><span>${obj['info']['em']}</span></div></li>
   <button type="button" class="btn btn-primary" onclick="info(undefined,'cl')">Close</button>
</div></li>
</ol>`;
    modal.style.display='flex';
    document.getElementById('cent').style.top="10%";
    }
    else{
       modal.style.display='none';
    }
}


function Alldone(){
    if(delivered.length!=fullOrd_details.length){
        alert('please deliver all before closing');
        return;
    }
    return new Promise((res,rj)=>{
        fetch('/alldone',{
            method:"POST",
            body:JSON.stringify({
                'date':date.trim(),
                'delord':fullOrd_details
                }),
            headers: {
                    'Content-Type': 'application/json'
                  }
        }).then((r)=>{window.open('index.html')});
});
}