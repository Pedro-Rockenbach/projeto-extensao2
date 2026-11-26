import { randomBytes, scrypt as scryptCallback, scryptSync, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const TAMANHO_SALT = 16;
const TAMANHO_HASH = 64;
const SALT_DUMMY = Buffer.alloc(TAMANHO_SALT);
const HASH_DUMMY = scryptSync("senha-inexistente", SALT_DUMMY, TAMANHO_HASH);

export async function hashSenha(senha) {
  const salt = randomBytes(TAMANHO_SALT);
  const hash = await scrypt(senha, salt, TAMANHO_HASH);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verificarSenha(senha, hashArmazenado) {
  const partes =
    typeof hashArmazenado === "string"
      ? /^scrypt\$([a-f\d]{32})\$([a-f\d]{128})$/i.exec(hashArmazenado)
      : null;
  const salt = partes ? Buffer.from(partes[1], "hex") : SALT_DUMMY;
  const hashEsperado = partes ? Buffer.from(partes[2], "hex") : HASH_DUMMY;
  const hashRecebido = await scrypt(senha, salt, TAMANHO_HASH);
  const corresponde = timingSafeEqual(hashRecebido, hashEsperado);

  return Boolean(partes) && corresponde;
}
