const path = require("path");
const fs = require("fs");
const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require("../models");

const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async (req, res = response) => {
	try {
		// txt, md
		//const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");

		// imagenes
		const nombre = await subirArchivo(req.files, undefined, "img");
		res.json({ nombre });
	} catch (msg) {
		res.status(400).json({ msg });
	}
};

const actualizarImagen = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el usuario con el id ${id}` });
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el producto con el id ${id}` });
			break;
		default:
			return res.status(500).json({ msg: "Olvide validar esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Borrar la imagen del servidor
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) fs.unlinkSync(pathImagen);
	}

	const nombre = await subirArchivo(req.files, undefined, coleccion);
	modelo.img = nombre;
	await modelo.save();

	res.json({ modelo });
};

const mostrarImagen = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el usuario con el id ${id}` });
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el producto con el id ${id}` });
			break;
		default:
			return res.status(500).json({ msg: "Olvide validar esto" });
	}

	if (modelo.img) {
		const pathImagen = path.join(
			__dirname,
			"../uploads",
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) return res.sendFile(pathImagen);
	}

	const pathImagenError = path.join(__dirname, "../assets/no-image.jpg");
	return res.status(404).sendFile(pathImagenError);
};

const actualizarImagenCloudinary = async (req, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case "usuarios":
			modelo = await Usuario.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el usuario con el id ${id}` });
			break;
		case "productos":
			modelo = await Producto.findById(id);
			if (!modelo)
				return res
					.status(400)
					.json({ msg: `No existe el producto con el id ${id}` });
			break;
		default:
			return res.status(500).json({ msg: "Olvide validar esto" });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Borrar la imagen de cloudinary
		const nombreArr = modelo.img.split("/");
		const nombre = nombreArr[nombreArr.length - 1];
		const [public_id] = nombre.split(".");
		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	modelo.img = secure_url;
	await modelo.save();

	res.json(modelo);
};

module.exports = {
	cargarArchivo,
	mostrarImagen,
	actualizarImagenCloudinary,
	mostrarImagen,
};
