const { app, server } = require("./app.js");
const { PORT = 9090 } = process.env;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}...`);
});
