const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
	const { correo, password } = req.body;

	try {
		// Verificar si el email existe
		const usuario = await Usuario.findOne({ correo });
		if (!usuario) return res.status(400).json({ msg: "Usuario incorrecto" });

		// Si el usuario está activo en la BD
		if (!usuario.estado)
			return res.status(400).json({ msg: "El usuario ya no existe" });

		// Verificar la contraseña
		const validarPassword = bcryptjs.compareSync(password, usuario.password);
		if (!validarPassword)
			return res.status(400).json({ msg: "Contraseña incorrecta" });

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({
			usuario,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: "Algo salió mal. Favor de comunicarse con el administrador",
		});
	}
};

module.exports = {
	login,
};
