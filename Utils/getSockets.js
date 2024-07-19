const usermap = new Map();

console.log("usermap",usermap);
function getSockets (users = []) {
    const sockets = users?.map((user) => usermap.get(user.toString()));
  
    return sockets;
};

module.exports = {getSockets,usermap};