const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize('hoidanit', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3307,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize.authenticate().then(()=> {
    console.log('database connect success!!')
}).catch((err)=> {
    console.log(err)
})

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false,
        get() {
            const rawValue = this.getDataValue('username')
            return rawValue ? rawValue.toUpperCase() : null
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6,12]
        }
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Member'
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 21
    }
})

User.findOne({where: {username: "tester"}})
.then((data)=> console.log(data.toJSON()))

// User.destroy({where: {}, force: true}).then(()=> console.log('Success delete!!'))

// User.findAll().then((data)=> {return data.map((data)=> data.toJSON())}).then((data)=>console.log(data))

// User.sync({alter: true}).then(()=> {
//     const user =  User.create({
//         username: "minhne",
//         password: "23",
//         role: 'Admin'
//     }, {fields: ['username','password','role']})
//     return user
// }).then((data)=> {
//     return data.decrement(['age'], {by: 2})
// }).then((data)=> {
//     console.log(data.toJSON())
// }).catch((err)=> {
//     console.log("Error syncing!!")
// })

// User.create({ 
//     username: "tester",
//     password: "234564",
//     role: "Admin"
// }, {fields: ['username', 'password']})
// .then((data)=>console.log(data.toJSON().username))
// .catch((err)=>console.log(err.message))

// User.findAll({
//     // attributes: [
//     //     'username', 'password',
//     //     [sequelize.fn('COUNT', sequelize.col('role')), '_role']
//     // ],
//     // attributes: {exclude: ['username']},
//     where : {
//         [Op.or]: [
          
//         ]
//     }
// })
//     .then((data)=> {
//         data.forEach(data => console.log(data.toJSON()))
//     })
//     .catch(err => console.log(err))

// User.findByPk(6).then((data)=> console.log(data.toJSON()))
// User.findAndCountAll({
//     where: {
//         username: {
//             [Op.like]: '%viet%'
//         }
//     },
//     limit: 4,
//     offset: 0
// })

// .then(({count, rows})=> console.log(rows.map((row)=>console.log(row.toJSON()))))