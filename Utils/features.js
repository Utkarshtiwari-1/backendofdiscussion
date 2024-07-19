

const Emitevent = (req,event,users,data)=>{

}

const getothermembers = (members,userid)=>{
    return members.filter((member)=>member._id.toString()!==userid.toString())

}

module.exports = {Emitevent,getothermembers};

