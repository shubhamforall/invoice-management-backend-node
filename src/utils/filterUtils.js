const { Op } = require("sequelize");

exports.applyFilters = (query, filterFields) => {
    const filters = {};

    for (const field of filterFields) {
        if (query[field]) {
            filters[field] = { [Op.iLike]: `%${query[field]}%` }; 
        }
    }

    return filters;
};

exports.applyDateRangeFilter = (query, fieldName) => {
    if (query.startDate && query.endDate) {
        return {
            [fieldName]: {
                [Op.between]: [query.startDate, query.endDate]
            }
        };
    }
    return {};
};
