const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos, validarArchivoSubir } = require("../middlewares");
const {
	cargarArchivo,
	actualizarImagenCloudinary,
	mostrarImagen,
} = require("../controllers/uploads.controller");
const { coleccionesPermitidas } = require("../helpers/db-validators");

const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);
router.put(
	"/:coleccion/:id",
	[
		validarArchivoSubir,
		check("id", "El id no es válido").isMongoId(),
		check("coleccion").custom((c) =>
			coleccionesPermitidas(c, ["usuarios", "productos"])
		),
		validarCampos,
	],
	// actualizarImagen
	actualizarImagenCloudinary
);

router.get(
	"/:coleccion/:id",
	[
		check("id", "El id no es válido").isMongoId(),
		check("coleccion").custom((c) =>
			coleccionesPermitidas(c, ["usuarios", "productos"])
		),
		validarCampos,
	],
	mostrarImagen
);

module.exports = router;
