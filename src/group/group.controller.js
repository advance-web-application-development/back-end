const Group = require("./group.model");
const UserGroup = require("./user_group.model");
const User = require("../user/user.model");
const { v4: uuidv4 } = require('uuid');
const { sendInvitationEmail } = require("../../config/nodemailer");
const FRONTEND_URL = process.env.FRONTEND_URL;

const createGroup = async(req, res)=>{
    const {name}= req.body;
    const user=req.user;
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
    const {email}= req.body;
    const groupId=req.params.id;
    const checkPermission=(await _isOwner(req.user, groupId))||(await _isCoOwner(req.user, groupId));
    if(!checkPermission)
    {
        return res
        .status(400)
        .send(
            "You are not allowed to access this"
        );
    }
    const user =await _getUserByEmail(email)

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
    const userGroup = _getUserGroupById(memberId)
    if(!userGroup)
    {
        return res
        .status(400)
        .send(
            "There was an error in creating a group. Please try again after few minutes"
        );
    }

    // const checkPermission=await _isOwner(req.user, userGroup.group_id);
    // if(!checkPermission)
    // {
    //     return res
    //     .status(400)
    //     .send(
    //         "You are not allowed to access this"
    //     );
    // }
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
    const userGroup = await UserGroup.find({ id: memberId, is_deleted:false });
    const checkPermission=(await _isOwner(req.user, groupId))||(await _isCoOwner(req.user, groupId));
    if(!checkPermission)
    {
        return res
        .status(400)
        .send(
            "You are not allowed to access this"
        );
    }

    console.log(userGroup);
    const member=await UserGroup.updateOne(
      { id: memberId },
      { is_deleted: true}
    );

    return res.send({member});
}
const getMyGroup = async(req, res)=>
{
    const user = req.user;
    
    const userGroup = await UserGroup.find({ user_id: user.id, is_deleted: false });
    let groups=[];
    for (const ug of userGroup) {
        console.log(ug)
        const group = await Group.findOne({ id: ug.group_id });
        if(group) groups.push(group)
    };
    console.log(userGroup)

    return res.send({groups});

}
const getMyOwnerGroup = async(req, res)=>
{
    const user = req.user;
    const userGroup = await UserGroup.find({ user_id: user.id, role: 'owner', is_deleted: false});
    let groups=[];
    for (const ug of userGroup) {
        const group = await Group.findOne({ id: ug.group_id,  is_deleted: false });
        if(group) groups.push(group)
    };
    return res.send({groups});

}
const getGroupMember = async(req, res)=>{
    const groupId = req.params.id;
    const userGroup = await UserGroup.find({ group_id: groupId, is_deleted: false });
    let users=[];
    for (const ug of userGroup) {
        const user = await User.findOne({ id: ug.user_id,  is_deleted: false });
        console.log(ug)
        if(user) users.push({id: ug.id, username: user.username, email: user.email, role: ug.role})
    };

    return res.send({users});

}
const _validateGroup = async(id)=>{
    const group = await Group.findOne({ id: id,  is_deleted: false });
    if(group&&group.length!=0) return true;
    return false;
}
const _validateRole = (newRole)=>{
    const availableRole = ["owner", "co-owner", "member"];
    return availableRole.includes(newRole);
}

const _getUserByEmail = async(email)=>{
    const user = await User.findOne({ email: email,  is_deleted: false });
    return user;
}
const _getUserGroupById = async(id)=>{
    const userGroup = await UserGroup.findOne({ id: id });
    return userGroup;
}
const _isOwner = async(user, groupId)=>{
    
    const userGroup = await UserGroup.findOne({ group_id: groupId, user_id: user.id, is_deleted: false});
    console.log(userGroup)
    if( userGroup?.role=='owner') return true;
    return false;
}
const _isCoOwner = async(user, groupId)=>{
    const userGroup = await UserGroup.findOne({ group_id: groupId, user_id: user.id, is_deleted:false });
    if( userGroup?.role=='co-owner') return true;
    return false;
}
const exitGroup = async(req, res)=>
{
    const groupId=req.params.id;
     const user = req.user;
    const userGroup = await UserGroup.findOne({ group_id: groupId, user_id: user.id, is_deleted: false });
    console.log(userGroup);
    const member=await UserGroup.updateOne(
      { id: userGroup.id },
      { is_deleted: true}
    );
    return res.send({member});
}
const joinGroup = async(req, res)=>
{
    const groupId=req.params.id;
    const user = req.user;
    const validate=await _validateGroup(groupId);
    console.log(validate);

    if(!validate||!user)
    {
        return res
        .status(400)
        .send(
            "There was an error in joining a group. Please try again after few minutes"
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
const isMember = async(req, res)=>
{
    const groupId=req.params.id;
     const user = req.user;
    const userGroup = await UserGroup.find({ group_id: groupId, user_id: user.id, is_deleted: false });
    if(!userGroup||userGroup.length==0)
    {
        return res
        .status(400)
        .send(
            "You are not group's member"
        );
    }

    return res.send({userGroup});
}
const sendInvitationMail = async(req, res)=>
{
    const groupId=req.params.id;
    const checkPermission=(await _isOwner(req.user, groupId))||(await _isCoOwner(req.user, groupId));
    if(!checkPermission)
    {
        return res
        .status(400)
        .send(
            "You are not allowed to access this"
        );
    }
    const {email}= req.body;
    const user =await _getUserByEmail(email)
    if(user&&user.id)
    {
        const userGroup = await UserGroup.find({ group_id: groupId, user_id: user.id, is_deleted: false });
        if(userGroup)
        {
            return res
            .status(400)
            .send(
                "This user already joined this group"
            );
        }
    }
    const group = await Group.findOne({ id: groupId,  is_deleted: false  });
    if(!group)
    {
        return res
        .status(400)
        .send(
            "There was an error in creating a group. Please try again after few minutes"
        );
    }
    sendInvitationEmail(group, email)
    return res.send({
        group: group,
        email: email
      });

}
const confirmMail = async(req, res)=>
{
    const groupId=req.params.id;
    const user = req.user;
    const validate=await _validateGroup(groupId);
    console.log(validate);
    if(!user||user.length==0)
    {
        console.log(FRONTEND_URL)
        return res.status(200).redirect(FRONTEND_URL);

    }
    if(!validate)
    {
        return res
        .status(400)
        .send(
            "There was an error in joining a group. Please try again after few minutes"
        );
    }
    const newMember={
        id: uuidv4(),
        group_id: groupId,
        user_id: user.id,
        role: 'member',
    }
    const member = await UserGroup.create(newMember);
      res.status(200).send({ message: "Joining new group is successful!!!" });
}
module.exports={
    createGroup,
    addMember,
    toggleRole,
    getMyGroup,
    getMyOwnerGroup,
    deleteMember,
    getGroupMember,
    exitGroup,
    joinGroup,
    isMember,
    sendInvitationMail,
    confirmMail
}