function log(){
    const usn=document.getElementById('usn').value;
    const pass=document.getElementById('ps').value;
    fetch('/log',{
        method:"POST",
        body:JSON.stringify({
            'usn':usn.trim(),
            'ps':pass.trim()}),
        headers: {
                'Content-Type': 'application/json'
              }
    }).then(
            (res)=>{
                return res.text();
            }).then(res=>{
                if(res==="Login"){
                    localStorage.setItem('printX',usn);
                    window.location.replace('index.html');
                }
                else{
                    alert("Login failed: "+res+"!!");
                }
});
}