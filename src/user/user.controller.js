const User = require("./user.model");
const getAllUser = async (req, res) => {
    const users = await User.find();
    return res.send({users});
};
module.exports={
    getAllUser,
}