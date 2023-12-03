const tab=document.getElementsByClassName('tab');
var fullOrd_details=[],logdata=[];
var details,unresolved={},done={},not_paid={},page_exceeds={},verified_ord;
window.addEventListener('load',async()=>{
   date=localStorage.getItem('date');
   const uscre=localStorage.getItem('printX');
   if(uscre==null || uscre===''){
    window.location.replace("log.html");
   }
    response=await getIndOrd();
    details=response['users'];

    verified_ord=await getverified_ord();
    details.forEach((el)=>{
        const obj={};
        obj['ord']=verified_ord.find(obj => obj['id']===el['id']);
        obj['info']=el;
        fullOrd_details.push(obj);
       });
    unres=await getUnres();
    console.log(response);
    Object.keys(unres).forEach(part=>{
        unres[part].forEach(prod =>{
        if(prod['d']!=undefined){  
        prod['d'].forEach((i)=>{
            done[i]=details.find(o=> o['id']===i);
        });}
        if(prod['ur']!=undefined){        
        prod['ur'].forEach((i)=>{
            unresolved[i]=details.find(o=> o['id']===i);
        });}
        if(prod['npaid']!=undefined){  
        prod['npaid'].forEach((i)=>{
            not_paid[i]=details.find(o=> o['id']===i);
        });}
        if(prod['expg']!=undefined){  
        prod['expg'].forEach((i)=>{
            page_exceeds[i]=details.find(o=> o['id']===i);
        });}
    });
    });
    console.log(done,unresolved,page_exceeds,not_paid);
    Object.keys(done).forEach(i=>{
        logdata.push(fullOrd_details.find(o=>o['ord']['id']===i));
    })
    console.log(logdata);
    await logDone();
   addDatatoTable();
});

function logDone(){
    return new Promise((res,rj)=>{
        fetch('/logDone',{
            method:"POST",
            body:JSON.stringify({
                'date':date.trim(),
                'done':logdata
                }),
            headers: {
                    'Content-Type': 'application/json'
                  }
        }).then((r)=>{
            return r.text();
    }).then((resr)=>{console.log(resr);res();})
});
}


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

function getUnres(){
    return new Promise((res,rj)=>{
        fetch('/unresolved',{
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
    const arr=[unresolved,not_paid,page_exceeds,done];
    const arr1=['unr','np','expg','done'];
    arr.forEach((cat)=>{
    var a=1;
    var str=`<tr>
    <th>S.No</th>
    <th>Order Id</th>
    <th>Message</th>
    <th>Refund</th>
    <th>Phone</th>
    <th>Name</th>
    <th>Email</th>
  </tr>`
    Object.keys(cat).forEach((el)=>{
        const obj=fullOrd_details.find(i=> i['ord']['id']==el);
        str=str+`<tr>
        <td>${a}</td>
        <td>${el}</td>
        <td><button id='${arr1[arr.indexOf(cat)]}${el}' onclick="msg('${el}','${arr1[arr.indexOf(cat)]}')" class='grn'>Msg</button></td>`;
        if(obj['ord']['pay']){
            str=str+`<td><button onclick="refund('${el}')" class='grn'>Refund</button></td>`  
        }
        else{
            str=str+`<td>-</td>` ; 
        }
        str=str+`
        <td>${obj['info']['ph']}</td>
        <td>${obj['info']['n']}</td>
        <td>${obj['info']['em']}</td></tr>`
        a++;
    });
    tab[arr.indexOf(cat)].innerHTML=str;
});
}

function msg(id,cont){
    const obj=fullOrd_details.find(i=> i['ord']['id']===id);
    text='';
    switch(cont){
        case 'unr':
           text="unresolved";
           break
        case 'np':
            text="Not paid";
            break
        case 'expg':
           text="extra pages";
           break
        case 'done':
           text="Order Done";
           break
    }
    str=`MIDWAY PrintX\nYour Order with order id:${obj['ord']['id']} is ${text}`;
    str=encodeURIComponent(str);
    const whatsapplink=`https://wa.me/91${obj['info']['ph']}?text=${str}`;
    window.open(whatsapplink, '_blank');
    const el=document.getElementById(cont+id);
    el.textContent="Msg Done";
    el.style.color='black';
    el.style.backgroundColor='transparent';
}