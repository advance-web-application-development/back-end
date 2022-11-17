const Group = require("./group.model");
const UserGroup = require("./user_group.model");
const User = require("../user/user.model");
const { v4: uuidv4 } = require('uuid');
const testUser= {
    id: "51052eb7-f4a6-47e0-9d07-6eca8893a439",
    username: "test-user",
    password: "test-user",

}
const createGroup = async(req, res)=>{
    const {name}= req.body;
    // const {username}=req.user;
    const user=testUser;
    const group = await Group.create({id:uuidv4(),name:name});
    if (!group||!user) {
        return res
            .status(400)
            .send(
                "There was an error in creating a group. Please try again after few minutes"
            );
    }
    const newOwner={
        id: uuidv4(),
        group_id: group.id,
        user_id: user.id,
        role: 'owner',
    }
    const owner = await UserGroup.create(newOwner);
    if (!owner) {
        return res
            .status(400)
            .send(
            "There was an error in creating a group. Please try again after few minutes"
            );
    }
    return res.send({group});
}
const addMember = async (req, res)=>
{
    // const {username}= req.body;
    const {username} = 'minh9';
    const groupId=req.params.id;
    const user =await _getUserByUsername(username)
    const validate=await _validateGroup(groupId);
    console.log(validate);

    if(!validate||!user)
    {
        return res
        .status(400)
        .send(
            "There was an error in creating a group. Please try again after few minutes"
        );
    }
    const newMember={
        id: uuidv4(),
        group_id: groupId,
        user_id: user.id,
        role: 'member',
    }
    const member = await UserGroup.create(newMember);
    return res.send({member});
}
const toggleRole = async (req, res)=>
{
    const memberId=req.params.id;
    const {newRole} = req.body;
    const validate = _validateRole(newRole);
    if(!validate)
    {
        return res
        .status(400)
        .send(
            "There was an error in creating a group. Please try again after few minutes"
        );
    }
    const coOwner=await UserGroup.updateOne(
      { id: memberId },
      { role: newRole,}
    );

    return res.send({coOwner});
}
const deleteMember = async(req, res)=>
{
    const memberId=req.params.id;
    const userGroup = await UserGroup.find({ id: memberId });
    console.log(userGroup);
    const member=await UserGroup.updateOne(
      { id: memberId },
      { is_deleted: true}
    );

    return res.send({member});
}
const getMyGroup = async(req, res)=>
{
    const user = testUser;
    const userGroup = await UserGroup.find({ user_id: user.id, is_deleted: false });
    let groups=[];
    for (const ug of userGroup) {
        const group = await Group.findOne({ id: ug.group_id });
        if(group) groups.push(group)
    };
    console.log(userGroup)

    return res.send({groups});

}
const getMyOwnerGroup = async(req, res)=>
{
    const user = testUser;
    const userGroup = await UserGroup.find({ user_id: user.id, role: 'owner', is_deleted: false});
    let groups=[];
    for (const ug of userGroup) {
        const group = await Group.findOne({ id: ug.group_id });
        if(group) groups.push(group)
    };
    return res.send({groups});

}
const getGroupMember = async(req, res)=>{
    const groupId = req.params.id;
    const userGroup = await UserGroup.find({ group_id: groupId, is_deleted: false });
    let users=[];
    for (const ug of userGroup) {
        const user = await User.findOne({ id: ug.user_id });
        if(user) users.push({id: ug.id, username: user.username, email: user.email, role: ug.role})
    };

    return res.send({groups});

}
const _validateGroup = async(id)=>{
    const group = await Group.findOne({ id: id });
    console.log(id);
    if(group&&group.length!=0) return true;
    return false;
}
const _validateRole = (newRole)=>{
    const availableRole = ["owner", "co-owner", "member"];
    return availableRole.includes(newRole);
}

const _getUserByUsername = async(username)=>{
    const user = await User.findOne({ email: 'hadtnt73@gmail.com' });
    return user;
}
module.exports={
    createGroup,
    addMember,
    toggleRole,
    getMyGroup,
    getMyOwnerGroup,
    deleteMember
}