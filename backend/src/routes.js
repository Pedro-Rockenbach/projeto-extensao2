
import { Router } from "express";
import UsuariosController from "./app/controllers/UsuarioController.js";
import PostagensController from "./app/controllers/PostagensController.js";
import SessaoController from "./app/controllers/SessaoController.js";
import { exigirLogin } from "./app/middlewares/sessao.js";

const router = Router();

// A rota de login cria a sessão com iniciarSessao (app/middlewares/sessao.js)
router.get("/sessao", SessaoController.show);
router.delete("/sessao", SessaoController.delete);

// Usuários só são consultados aqui; quem cria e atualiza o autor é a rota
// de postagens
router.get("/usuarios", UsuariosController.index);
router.get("/usuarios/:id", UsuariosController.show);

// Ver os projetos é público; publicar, editar e excluir exigem login
router.get("/postagens", PostagensController.index);
router.get("/postagens/:id", PostagensController.show);
router.post("/postagens", exigirLogin, PostagensController.store);
router.put("/postagens/:id", exigirLogin, PostagensController.update);
router.delete("/postagens/:id", exigirLogin, PostagensController.delete);

export default router;
