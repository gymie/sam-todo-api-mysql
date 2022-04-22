const { nanoid } = require("nanoid");
const mysql = require("mysql");
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

const headers = {
    "Content-Type": "application/json"
};

exports.handler = async (event, context) => {
    const { requestContext: { http: { method } } } = event;
    // const { httpMethod: method } = event;

    if(method === "GET"){
        const { queryStringParameters } = event;
        if(!queryStringParameters){
            response = await TodoFunctions.getAllTodos()
            .then(results => {
                return {
                    "statusCode": 200,
                    "body": JSON.stringify({
                        todos: results
                    })
                }
            })
        }else{
            const { id } = queryStringParameters;
            response = await TodoFunctions.getTodo(id)
                .then(results => {
                    return {
                        "statusCode": 200,
                        "body": JSON.stringify({
                            todo: results
                        })
                    }
                })
        }
    }else if(method === "POST") {
        const { title } = JSON.parse(event.body);
        response = await TodoFunctions.insertTodo(title)
            .then(results => {
                return {
                    "statusCode": 201,
                    "body": JSON.stringify({
                        todoId: results.todoId
                    })
                }
            })
    }else if(method === "PUT"){
        const { queryStringParameters: { id } } = event;
        response = await TodoFunctions.updateTodo(id)
            .then(results => {
                return TodoFunctions.getTodo(id)
            })
            .then(results => {
                return {
                    "statusCode": 200,
                    "body": JSON.stringify({
                        todo: results
                    })
                }
            })
    }else if(method === "DELETE"){
        const { queryStringParameters: { id } } = event;
        response = await TodoFunctions.deleteTodo(id)
            .then(results => {
                return {
                    "statusCode": 200,
                    "body": JSON.stringify({
                        message: results.affectedRows === 1?"Berhasil hapus todo":"Gagal hapus todo"
                    })
                }
            })
    }

    return {
        "statusCode": response.statusCode,
        headers,
        "body": response.body
    };
}

const TodoFunctions = {
    getAllTodos: () => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tbltodo",(error,results) => {
                if (error) reject(error);
                resolve(results);
            })
        });
    },
    insertTodo: (title) => {
        return new Promise((resolve, reject) => {
            const id = `todo-${nanoid(16)}`;

            pool.query("INSERT INTO tbltodo SET ?",{id,title,status: 0},(error, results) => {
                if(error) reject(error);
                resolve({todoId: id});
            })
        });
    },
    getTodo: (id) => {
        return new Promise((resolve, reject) => {
            pool.query("SELECT * FROM tbltodo where id=?",[id],(error,results) => {
                if (error) reject (error);
                resolve(results)
            })
        })
    },
    updateTodo: (id) => {
        return new Promise((resolve, reject) => {
            const now = new Date().toISOString();
            pool.query("UPDATE tbltodo set status=1 where id=?",[id],(error,results) => {
                if (error) reject (error);
                resolve(results)
            })
        })
    },
    deleteTodo: (id) => {
        return new Promise((resolve, reject) => {
            pool.query("DELETE FROM tbltodo where id=?",[id],(error,results) => {
                if (error) reject (error);
                resolve(results)
            })
        })
    },
}