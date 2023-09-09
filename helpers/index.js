const dbValidarots = require("./db-validators");
const generarJWT = require("./generar-jwt");
const googleVerify = require("./google-verify");
const subirArchivo = require("./subir-archivo");

module.exports = {
	...dbValidarots,
	...generarJWT,
	...googleVerify,
	...subirArchivo,
};
