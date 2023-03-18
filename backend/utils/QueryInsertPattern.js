const RestApiMethods = {
    insert: (table, column) => {
        return `INSERT INTO ${table} (${column.join(
            ","
          )}) VALUES (${column.map((x) => `:${x}`).join(", ")})`
    },

    update: (table, columns, colCond) => {
        return  `UPDATE ${table} SET ${columns.map(x => `${x} = ?`)} WHERE ${colCond.map(col => `${col} = ?`)}`
    },

    delete: (table, colCond) => {
        return `DELETE FROM ${table} WHERE ${colCond.map(col => `${col} = ?`)}`
    }
}

module.exports = RestApiMethods