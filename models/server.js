const express = require("express");
const cors = require("cors");
const req = require("express/lib/request");
const { dbConnection } = require("../database/config");

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			auth: "/api/auth",
			buscar: "/api/buscar/",
			usuarios: "/api/usuarios",
			categorias: "/api/categorias",
			productos: "/api/productos",
		};

		// Conectar a la base de datos
		this.conectarDB();

		// Middlewars
		this.middlewares();

		// Rutas
		this.routes();
	}

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		// Lectura y parseo del body
		this.app.use(express.json());

		// Directorio público
		this.app.use(express.static("public"));
	}

	routes() {
		this.app.use(this.paths.auth, require("../routes/auth.routes"));
		this.app.use(this.paths.usuarios, require("../routes/user.routes"));
		this.app.use(this.paths.categorias, require("../routes/categorias.routes"));
		this.app.use(this.paths.productos, require("../routes/productos.routes"));
		this.app.use(this.paths.buscar, require("../routes/buscar.routes"));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log("Servidor corriendo en el puerto", this.port);
		});
	}
}

module.exports = Server;
