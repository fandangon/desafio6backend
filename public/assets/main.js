
//Cliente WebSocket
const socket =io();
socket.on("connect", () => {
  console.log("Conectado al servidor");
});

socket.on("UPDATE_MESSAGES", (msg, allMessages) => {
  document.getElementById("posts").innerHTML = "";
   allMessages
     .sort((a,b) => a.date - b.date)
     .forEach(msg => appendMessage(msg));
});

socket.on("NEW_MESSAGE", (msg) => {
  appendMessage(msg);
})

function appendMessage(msg) {
  document.getElementById("posts").innerHTML += `
    <div class="post ui card">
      <div class="content">
        <b class="mail">${msg.mail}</b><b class="date">${msg.date}</b><b class="mensaje"> ${msg.mensaje}</b>
        <hr/>
      </div>
    </div>
  `;
}


 function enviarMensaje(){
   const mail = document.getElementById("mail").value;
   const mensaje = document.getElementById("mensaje").value;

   if((mail!="")&&(mensaje!=""))
   {
   socket.emit("POST_MESSAGE", {mail,mensaje});
  }
 }

 function enviarProducto(){
   const title = document.getElementById("title").value;
   const price = document.getElementById("price").value;
   const thumbnail = document.getElementById("thumbnail").value;
   if ((title!="")&& (price!="")&&(thumbnail!=""))
   {
   socket.emit("POST_PRODUCTS", {title,price,thumbnail});
  }
   
 }

 socket.on("productos_registrados", (products) => {
  
  const url = "http://localhost:8080/productos.hbs";
    fetch(url).then((resp) => {
      
      return resp.text();
  }).then((text) => {
    const template = Handlebars.compile(text);
    const html = template({products: products});
     document.querySelector("#products").innerHTML = html;
  });
})
 