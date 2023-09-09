const validarCampos = require("./validar-campos");
const validarJWT = require("./validar-jwt");
const validaRoles = require("./validar-roles");
const validarArchivoSubir = require("./validar-archivo");

module.exports = {
	...validarCampos,
	...validarJWT,
	...validaRoles,
	...validarArchivoSubir,
};
