import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import session from "express-session";
import { 
  homeRouter,
  productRouter,
  loginRouter,
  signupRouter,
  apiRandomsRouter,
  logoutRouter,
  infoRouter, } from "./routes/index.js";
import { socketController } from "./src/utils/socketController.js";


// Variable de entrotno
import  {PORT, MONGOPASS} from "./config.js";


// Login ---------------------------------------------------------------------------
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import redis from "redis";
import connectRedis from "connect-redis";
import mongoose from "mongoose";
import Usuarios from "./models/usuarioSchema.js";
import { isValidPassword, createHash } from "./src/utils/passwordsFunctions.js";


//Creacion de Servidor y Sockets ---------------------------------------------------
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {});
socketController(io);

//Configuro Servidor ----------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Base de Datos---------- ----------------------------------------------------------
mongoose
  .connect(
    `mongodb+srv://mauronadal32065:${MONGOPASS}@cluster0.tmjja4h.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connectado con Mongo Atlas"));


// Login Passport -----------------------------------------------------------
passport.use(
   "login",
    new LocalStrategy((username, password, done) => {
    Usuarios.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) {
        console.log("User not found with username " + username);
        return done(null, false);
        //null significa sin error, y false parametro a enviar
      }
      if (!isValidPassword(user, password)) {
        console.log("Invalid Password");
        return done(null, false);
      }
      return done(null, user);
    });
  })
);

// signup Passport ----------------------------------------------------------
passport.use(
  "signup",
  new LocalStrategy(
   
    { passReqToCallback: true },
    (req, username, password, done) => {
      Usuarios.findOne({ username: username }, function (error, user) {
        if (error) {
          console.log("Error in SingnUp: " + error);
          return done(error);
        }
        if (user) {
          console.log("User already exists");
          return done(null, false);
        }
        const newUser = {
          username: username,
          password: createHash(password),
        };
        Usuarios.create(newUser, (err, user) => {
          if (err) {
            console.log("Error in Saving user: " + err);
            return done(err);
          }
          console.log("User Registration succesful");
       
          return done(null, user);
        });
      });
    }
  )
);

// Passport necessary Middlewares ---------------------------------------------------

passport.serializeUser((user, done) => {
  done(null, user._id);
});
passport.deserializeUser((id, done) => {
  Usuarios.findById(id, done);
});



// Inicio de Servidor ---------------------------------------------------------------

httpServer.listen(process.env.PORT || PORT, () =>
  console.log("Servidor http escuchando en el puerto: " + PORT)
);
httpServer.on("error", (error) => console.log(`Error en servidor ${error}`));

// Redis --------------------------------------------------------------
//const client = redis.createClient({ legacyMode: true });
//client.connect();
//const RedisStore = connectRedis(session);

app.use(
  session({
    //store: new RedisStore({ host: "localhost", port: 6379, client, ttl: 300 }),
    secret: "secreto",
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 86400000, // 1 dia
    },
    rolling: true,
    resave: true,
    saveUninitialized: false,
  })
);

// Middleware Passport --------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());

// Middleware Carpeta Public ----------------------------------------------
app.use(express.static(__dirname + "/public"));

// Motor de Platillas ---------------------------------------------------------------

app.set("view engine", "ejs");
app.set("views", "./views");

// Formato JSON ----------------------------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Sesion MongoDB --------------------------------------------------------------------
//app.use(
//  session({
//    store: MongoStore.create({
//      mongoUrl:
//        "mongodb+srv://mauronadal32065:teaVeWUKN0jNX0yX@cluster0.tmjja4h.mongodb.net/?retryWrites=true&w=majority",
//      mongoOptions: advancedOptions,
//    }),
//    secret: "secreto",
//    cookie: { maxAge: 600000 },
//  
//    resave: false,
//    saveUninitialized: false,
//  })
//);

// Refresh ---------------------------------------------------------------------------

app.use((req, res, next) => {
  req.session.touch();
  next();
});

// Rutas -----------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/login", loginRouter);
app.use("/signup", signupRouter);
app.use("/home", homeRouter);
app.use("/api/randoms", apiRandomsRouter);
app.use("/logout", logoutRouter);
app.use("/info", infoRouter);
app.use("/products", productRouter);

function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

app.get("/ruta-protegida", checkAuthentication, (req, res) => {
  const { username, password } = req.user;
  const user = { username, password };
  res.send("<h1>Ruta ok!</h1>" + JSON.stringify(user));
});

// Error de request -------------------------------------------------------------------
app.all("*", (req, res) => {
  res.status(404).send("Ruta no encontrada");
});


