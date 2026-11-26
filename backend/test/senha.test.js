import test from "node:test";
import assert from "node:assert/strict";
import { hashSenha, verificarSenha } from "../src/app/utils/senha.js";

test("hash de senha pode ser verificado sem armazenar a senha original", async () => {
  const senha = "uma-senha-de-teste-segura";
  const hash = await hashSenha(senha);

  assert.match(hash, /^scrypt\$[a-f\d]{32}\$[a-f\d]{128}$/);
  assert.notEqual(hash, senha);
  assert.equal(await verificarSenha(senha, hash), true);
});

test("senha incorreta e hash ausente são recusados", async () => {
  const hash = await hashSenha("uma-senha-de-teste-segura");

  assert.equal(await verificarSenha("senha-incorreta", hash), false);
  assert.equal(await verificarSenha("uma-senha-de-teste-segura", null), false);
});
