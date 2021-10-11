const express = require("express")
const app = express()
const {sequelize, User} = require("./database/sequelize")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))

app.get("/", (req,res) =>{
    res.send('./public/index.html')
})

app.post("/users", async (req,res) =>{
    console.log(req.body)
    const user = await User.create({firstName: req.body.firstName, lastName: req.body.lastName})
    res.send(user)

})

sequelize.sync({logging: false}).then(() => {
    console.log('database in sync')
})
app.listen(8080)