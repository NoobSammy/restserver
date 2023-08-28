const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const { nombre, img, correo } = await googleVerify(id_token);

		let usuario = await Usuario.findOne({ correo });

		// Crear usuario si no existe
		if (!usuario) {
			const data = {
				nombre,
				correo,
				password: "penta0m",
				img,
				google: true,
				rol: "USER_ROLE",
			};

			usuario = new Usuario(data);
			await usuario.save();
		}

		// Si el usuario en DB
		if (!usuario.estado) {
			return res.status(401).json({
				msg: "Hable con el admnistrador, usuario bloqueado",
			});
		}

		// Generar el JWT
		const token = await generarJWT(usuario.id);

		res.json({ usuario, token });
	} catch (error) {
		console.log(error);
		res.status(400).json({
			ok: false,
			msg: "El token no se pudo verificar",
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
