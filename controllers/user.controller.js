const { request, response } = require("express");

const usuariosGet = (req = request, res = response) => {
	const query = req.query;

	res.json({
		msg: "get API",
		query,
	});
};

const usuariosPut = (req, res = response) => {
	const id = req.params.id;

	res.status(400).json({
		msg: "put API",
		id,
	});
};

const usuariosPost = (req, res = response) => {
	const body = req.body;

	res.status(201).json({
		msg: "post API",
		body,
	});
};

const usuariosDelete = (req, res = response) => {
	res.json({
		msg: "delete API",
	});
};

const usuariosPatch = (req, res = response) => {
	res.json({
		msg: "patch API",
	});
};

module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosPatch,
	usuariosDelete,
};
