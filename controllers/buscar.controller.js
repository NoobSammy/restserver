const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.status(200).json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, "i");
	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	return res.status(200).json({
		results: usuarios,
	});
};

const buscarCategorias = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);
		return res.status(200).json({
			results: categoria ? [categoria] : [],
		});
	}

	const regex = new RegExp(termino, "i");
	const categorias = await Categoria.find({ nombre: regex, estado: true });

	return res.status(200).json({
		results: categorias,
	});
};

const buscarProductos = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino);
		return res
			.status(200)
			.json({
				results: producto ? [producto] : [],
			})
			.populate("categoria", "nombre");
	}

	const regex = new RegExp(termino, "i");
	const productos = await Producto.find({
		nombre: regex,
		estado: true,
	}).populate("categoria", "nombre");

	return res.status(200).json({
		results: productos,
	});
};

const buscarRoles = async (termino = "", res = response) => {
	const esMongoID = ObjectId.isValid(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);
		return res.status(200).json({
			results: usuario ? [usuario] : [],
		});
	}

	const regex = new RegExp(termino, "i");
	const usuarios = await Usuario.find({
		$or: [{ nombre: regex }, { correo: regex }],
		$and: [{ estado: true }],
	});

	return res.status(200).json({
		results: usuarios,
	});
};

const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion))
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
		});

	switch (coleccion) {
		case "usuarios":
			buscarUsuarios(termino, res);
			break;
		case "categorias":
			buscarCategorias(termino, res);
			break;
		case "productos":
			buscarProductos(termino, res);
			break;
		case "roles":
			break;
		default:
			res.status(500).json({
				msg: "Se me olvido hacer está búsqueda",
			});
	}
};

module.exports = { buscar };
