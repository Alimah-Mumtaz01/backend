const {User} = require('../models');

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: ['id_user', 'nama', 'email', 'no_hp', 'role', 'createdAt', 'updatedAt'],
            order: [['id_user', 'ASC']]
        });
        return users;
    } catch (error) {
        throw error;
    }
};

const getUserById = async (id_user) => {
    try {
        const user = await User.findByPk(id_user, {
            attributes: ['id_user', 'nama', 'email', 'no_hp', 'role', 'createdAt', 'updatedAt']
        });
        return user;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById
};