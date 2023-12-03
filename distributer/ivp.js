const os = require('os');

function getIPv4Address() {
return new Promise((r,rj)=>{
  const interfaces = os.networkInterfaces();
  let ipv4Address = '';

  for (const interfaceName in interfaces) {
    const interfaceInfo = interfaces[interfaceName];
    for (const info of interfaceInfo) {
      if (info.family === 'IPv4' && !info.internal) {
        ipv4Address = info.address;
        break;
      }
    }
    if (ipv4Address){
        r(ipv4Address);
        break;
    };
  }

});
}

module.exports={
    ivp:getIPv4Address
}