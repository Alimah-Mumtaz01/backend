const { User, Order } = require("../models");
const { Op } = require("sequelize");

const getAllUsers = async () => {
    try {
        const users = await User.findAll({
            attributes: [
                "id_user",
                "nama",
                "email",
                "no_hp",
                "role",
                "createdAt",
                "updatedAt",
            ],
            order: [["id_user", "ASC"]],
        });

        return users;
    } catch (error) {
        throw error;
    }
};

const getUserById = async (id_user) => {
    try {
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
        });

        return user;
    } catch (error) {
        throw error;
    }
};

const getAllCustomers = async ({
    page = 1,
    limit = 8,
    search = "",
}) => {
    try {
        page = Math.max(1, Number(page) || 1);
        limit = Math.min(
            100,
            Math.max(1, Number(limit) || 8)
        );

        const offset = (page - 1) * limit;

        const where = {
            role: "user",
        };

        if (search.trim()) {
            where[Op.or] = [
                {
                    nama: {
                        [Op.like]: `%${search.trim()}%`,
                    },
                },
                {
                    email: {
                        [Op.like]: `%${search.trim()}%`,
                    },
                },
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where,
            attributes: [
                "id_user",
                "nama",
                "email",
                "no_hp",
            ],
            order: [["id_user", "ASC"]],
            limit,
            offset,
        });

        const customerIds = rows.map(
            (customer) => customer.id_user
        );

        let orderCounts = [];

        if (customerIds.length > 0) {
            orderCounts = await Order.findAll({
                attributes: [
                    "id_user",
                    [
                        Order.sequelize.fn(
                            "COUNT",
                            Order.sequelize.col("id_order")
                        ),
                        "total_pesanan",
                    ],
                ],
                where: {
                    id_user: {
                        [Op.in]: customerIds,
                    },
                },
                group: ["id_user"],
                raw: true,
            });
        }

        const orderCountMap = {};

        orderCounts.forEach((item) => {
            orderCountMap[item.id_user] =
                Number(item.total_pesanan) || 0;
        });

        const customers = rows.map((customer) => ({
            id_user: customer.id_user,
            nama: customer.nama,
            email: customer.email,
            no_hp: customer.no_hp,
            total_pesanan:
                orderCountMap[customer.id_user] || 0,
        }));

        return {
            customers,
            pagination: {
                currentPage: page,
                totalPages: Math.max(
                    1,
                    Math.ceil(count / limit)
                ),
                totalItems: count,
                limit,
            },
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    getAllCustomers,
};