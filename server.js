const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const contenedor = require('./public/assets/archivos')
const events=require("./public/assets/events")
const productos = new contenedor('./public/assets/productos.json')
const mensajes = new contenedor('./public/assets/messages.json')
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");

const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const hbs = handlebars.create({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/public",
});

 app.engine("hbs", hbs.engine);
 app.set('views', "./public");
 app.set("view engine", "hbs");

// ESCUCHANDO EN PUERTO 8080
const PORT = 8080;
const server = httpServer.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`)
});
server.on("error", error => console.log(`Error: ${error}`))
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.render("index");
});
    


      socketServer.on("connection", (socket) => {
       console.log("Nuevo client conectado");
       socketServer.emit(
         "productos_registrados",
       productos.getAll()),
       socketServer.emit(
        events.UPDATE_MESSAGES,
        "Bienvenido al WebSocket",
      mensajes.getAll(),
         
       );
       
  

     socket.on(events.POST_MESSAGE, (msg) => {
      let fecha=new Date;
       const _msg = {
         ...msg, 
         date: fecha.toGMTString()
       };
       mensajes.save(_msg);
       socketServer.sockets.emit(events.NEW_MESSAGE, _msg);
     });

     socket.on(events.POST_PRODUCTS, (prod) => {
       const _prod = {
         ...prod
       };
       productos.save(_prod);
       socketServer.sockets.emit(events.NEW_PRODUCTS, _prod);
     });
    });
  

   
  

    