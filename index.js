require("dotenv").config();

const fastify = require("fastify")({
  logger: true,
});

fastify.register(require("@fastify/cors"), {
  // put your options here
});

const axios = require("axios").default;

const proxyToVendor = async (proxyUrl) => {
  try {
    const response = await axios.get(
      `${process.env.PROXY_ENDPOINT}${proxyUrl}`,
      { headers: { Authorization: `Bearer ${process.env.PROXY_TOKEN}` } }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

fastify.get("*", async (request, reply) => {
  const { status, data } = await proxyToVendor(request.url);
  return { status, data };
});

fastify.listen(process.env.PORT, "0.0.0.0", (err, address) => {
  if (err) throw err;
  fastify.log.info(`server listening on ${address}`);
});
