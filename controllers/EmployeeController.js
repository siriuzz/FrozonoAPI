const { Employee } = require('../models');
const Op = require('sequelize').Op;

const getEmployees = async (req, res) => {
    try {
        if (req.query !== null) {
            const page = parseInt(req.query.page) || 1;
            const per_page = parseInt(req.query.per_page) || 10; //itemes por defecto
            const name = req.query.name || '';
            const startIndex = (page - 1) * per_page;
            console.log(req.query);

            const employees = await Employee.findAll({
                offset: startIndex,
                limit: per_page,
                where: {
                    [Op.or]: Array.isArray(name) === false ?
                        { name: { [Op.iLike]: `%${name}%` } } :
                        name.map(name => ({ name: { [Op.like]: `%${name}%` } })) // Busca todos los nombres que coincidan con el query
                }
            }); // Busca todos los inventarios
            return employees;

        } else {
            const employees = await Employee.findAll(); // Busca todos los inventarios
            // Devuelve los inventarios en formato json
            return employees;
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener empleados' });
    }
};

module.exports = {
    getEmployees
}