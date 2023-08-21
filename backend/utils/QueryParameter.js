const { Op } = require("sequelize");

const QueryParameter = {
  querySearch: (search_list = []) => {
    let searchReturn = {};
    if (search_list.length > 0) {
      for (let i of search_list) {
        searchReturn[i["name_field"]] = { [Op.like]: `%${i.value_search}%` };
      }
    }
    return searchReturn;
  },

  querySort: (sort = []) => {
    let sortReturn = [];
    sortReturn.push(['createdAt', 'ASC'])
    if (sort.length > 0) {
      for (let i of sort) {
        sortReturn.push([i.name_field, i.sort_type]);
      }
    }
    return sortReturn;
  },
};

module.exports = QueryParameter
