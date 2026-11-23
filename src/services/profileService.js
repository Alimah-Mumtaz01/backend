const { User, Address } = require("../models");

const getProfile = async (id_user) => {
    const user = await User.findByPk(id_user, {
        attributes: [
            "id_user",
            "nama",
            "email",
            "no_hp",
            "role",
            "createdAt",
            "updatedAt",
        ],
        include: [
            {
                model: Address,
                as: "address",
                required: false,
            },
        ],
    });

    if (!user) {
        throw new Error("Data customer tidak ditemukan");
    }

    return user;
};

const savePrimaryAddress = async (id_user, addressData) => {
    const user = await User.findByPk(id_user);

    if (!user) {
        throw new Error("Data customer tidak ditemukan");
    }

    const [address, created] = await Address.findOrCreate({
        where: { id_user },
        defaults: {
            id_user,
            ...addressData,
        },
    });

    if (!created) {
        await address.update(addressData);
    }

    return address;
};

module.exports = {
    getProfile,
    savePrimaryAddress,
};