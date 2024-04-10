const createError = require("http-errors")
const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const logger = require("morgan")

const indexRouter = require("./routes/index")
const catalogRouter = require("./routes/catalog")

const mongoose = require("mongoose")
const compression = require("compression")

const app = express()

// Set up mongoose connection
mongoose.set("strictQuery", false)
const dev_db_url = `mongodb+srv://rajsv04:csNqYNF3snZc82Zi@odincluster.ytahoml.mongodb.net/?retryWrites=true&w=majority&appName=OdinCluster`
const mongodb = process.env.MONGODB_URI || dev_db_url
function main() {
  return mongoose.connect(mongodb)
}
main().catch(console.log)

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
)

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(compression())

app.use(express.static(path.join(__dirname, "public")))

app.use("/", indexRouter)
app.use("/catalog", catalogRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render("error")
})

module.exports = app