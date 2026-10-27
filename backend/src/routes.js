
import { Router } from "express";
import UsuariosController from "./app/controllers/UsuarioController.js";
import PostagensController from "./app/controllers/PostagensController.js";

const router = Router();

// Sem login ainda: usuários só são consultados aqui; quem cria e atualiza
// o autor é a rota de postagens. Rotas de escrita voltam com a autenticação.
router.get("/usuarios", UsuariosController.index);
router.get("/usuarios/:id", UsuariosController.show);

router.get("/postagens", PostagensController.index);
router.get("/postagens/:id", PostagensController.show);
router.post("/postagens", PostagensController.store);
router.put("/postagens/:id", PostagensController.update);
router.delete("/postagens/:id", PostagensController.delete);

export default router;
