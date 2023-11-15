const { Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize('checkmysql', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3310,
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
        unique: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'Member'
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

sequelize.sync() .then(()=> {console.log('da tao bang thanh cong')})


module.exports = User