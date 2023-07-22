
const path = require("path");

const fastify = require("fastify")({ logger: false })

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
});

fastify.register(require("@fastify/formbody"));

fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

const getFormattedCurrentTime = () => {
  const date = new Date()
  
  const dateStr = [
    date.getFullYear(), 
    date.getMonth() + 1,
    date.getDate(),
  ].map(String).map(s => s.padStart(2, '0')).join('/')

  const timeStr = [
    date.getHours(), 
    date.getMinutes(),
    date.getSeconds(),
  ].map(String).map(s => s.padStart(2, '0')).join(':')
  
  return [dateStr, timeStr].join(' ')
}


fastify.get("/", function (request, reply) {
  return reply.view("/src/pages/index.hbs");
});

fastify.get("/ssr/server-time", function (request, reply) {
  let params = { server_time: getFormattedCurrentTime() };  
  return reply.view("/src/pages/ssr/server-time.hbs", params);
});

fastify.get("/csr/server-time", function (request, reply) {
  return reply.view("/src/pages/csr/server-time.hbs");
});

fastify.get("/csr/client-time", function (request, reply) {
  return reply.view("/src/pages/csr/client-time.hbs");
});

fastify.get("/api/server-time", function (request, reply) {
  reply.code(200).send({ time: getFormattedCurrentTime(), });
});


// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
