const socket = io();

const buttonLogin = document.getElementById("login-btn");
buttonLogin.addEventListener("click", (e) => {
  const user = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
  };
  socket.emit("login", JSON.stringify(user));
});

const showPassword = document.getElementById("show-password");

showPassword.addEventListener("click", () => {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
});
