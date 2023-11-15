const express = require('express')
const app = express()
const port = 8080
var bodyParser = require('body-parser')
const path = require('path')
const router = express.Router()
const User = require('./database')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const secret = 'cuongen123'
const saltRounds = 10
var session = require('express-session')
const redis = require('redis')
const { default: RedisStore } = require('connect-redis')
const redisClient = redis.createClient()
var passport = require('passport');
var LocalStrategy = require('passport-local')
const { match } = require('assert')

redisClient.on('error', (err)=> {
  console.log('Error: ', err)
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const redisStore = new RedisStore({
  client: redisClient
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 115000 }
}))

app.get('/demo', function(req, res, next) {
  if (req.session.data) {
    req.session.data++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.data + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.data = 1
    res.end('welcome to the session demo. refresh!')
  }
})

router.get('/', (req,res)=> {
  res.sendFile(path.join(__dirname, 'home.html'))
})

router.get('/login', (req,res)=> {
  res.sendFile(path.join(__dirname, 'login.html'))
})

router.get('/register', (req,res)=> {
  res.sendFile(path.join(__dirname, 'register.html'))
})

passport.use(new LocalStrategy(function verify(username, password, done){
  User.findOne({
    where: {
      username: username
    }
  })
  .then((data)=> {
    if(!data) {
      return done(null, false)
    } else {
      bcrypt.compare(password, data.password, (err, match)=> {
        if(err) {
          done(err, false)
        } else {
          if(match) {
            done(null, data)
          } else {
            done(null, false)
          }
        }
      })
    }
  })
  .catch((err)=> {
    done(err)
  })
}))

router.post('/login', (req,res,next)=> {
  passport.authenticate('local', (err, user)=> {
    if(err) {return res.status(500).json(err)}
    if(!user) {return res.json('Người dùng ko hợp lệ')}
    jwt.sign({id: user.id}, secret, {algorithm: 'HS256', expiresIn: '24h'}, (err,data)=> {
      if(err) return res.status(500).json('Lỗi server!!')
      return res.json(data)
    })
  })(req, res, next);
});

router.get('/admin', (req,res,next)=> {
  const token = req.headers["authorization"].split(" ")[1]
  jwt.verify(token, secret, (err,data)=>{
    if(err) return res.status(403).json('Yêu cầu login!!')
    req.data = data
    next()
  })
}, (req,res,next)=> {
  console.log(req.data.id)
})

router.post('/register', (req, res)=> {
  const {username, password, age} = req.body
  if(username && password && age) {
    User.findOne({where: {username: username}})
    .then((data)=> {
      if(!data) {
        bcrypt.hash(password, saltRounds, (err, hash)=>{
          User.create({
            username: username,
            password: hash,
            age: age
          })
          .then(()=> res.json('Đăng kí thành công!!'))
        })
      } else {
        res.json('Tài khoản đã tồn tại!').status(400)
      }
    })
  } else {
    res.json('Yêu cầu điền vào form').status(400)
  }
})

app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})