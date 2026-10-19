
import { Router } from "express";
import UsuariosController from "./app/controllers/UsuarioController.js";
import PostagensController from "./app/controllers/PostagensController.js";

const router = Router();

router.get("/usuarios", UsuariosController.index);
router.get("/usuarios/:id", UsuariosController.show);
router.post("/usuarios", UsuariosController.store);
router.put("/usuarios/:id", UsuariosController.update);
router.delete("/usuarios/:id", UsuariosController.delete);

router.get("/postagens", PostagensController.index);
router.get("/postagens/:id", PostagensController.show);
router.post("/postagens", PostagensController.store);
router.put("/postagens/:id", PostagensController.update);
router.delete("/postagens/:id", PostagensController.delete);

export default router;

