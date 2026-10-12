import { Router } from "express";
import UsuariosController from "./app/controllers/UsuarioController.js";

const router = Router();

router.get("/usuarios", UsuariosController.index);
router.get("/usuarios/:id", UsuariosController.show);
router.post("/usuarios", UsuariosController.store);
router.delete("/usuarios/:id", UsuariosController.delete);
router.put("/usuarios/:id", UsuariosController.update);

export default router;
