const { Router } = require("express");
const { check } = require("express-validator");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares/");
const {
	crearCategoria,
	obtenerCategorias,
	obtenerCategoria,
	actualizarCategoria,
	borrarCategoria,
} = require("../controllers/categorias.controller");
const { existeCategoria } = require("../helpers/db-validators");

const router = Router();

// Obtener todas las categorias
router.get("/", obtenerCategorias);

// Obtener una categoria por id
router.get(
	"/:id",
	[
		check("id", "No es un ID valido").isMongoId(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	obtenerCategoria
);

// Crear categoria - privado - con token valido
router.post(
	"/",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		validarCampos,
	],
	crearCategoria
);

// Actualizar - privado- con token valido
router.put(
	"/:id",
	[
		validarJWT,
		check("nombre", "El nombre es obligatorio").not().isEmpty(),
		check("id", "No es un ID valido").isMongoId(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	actualizarCategoria
);

// Borrar una categoria - Admin
router.delete(
	"/:id",
	[
		validarJWT,
		esAdminRole,
		check("id", "No es un ID valido").isMongoId(),
		check("id").custom(existeCategoria),
		validarCampos,
	],
	borrarCategoria
);

module.exports = router;
