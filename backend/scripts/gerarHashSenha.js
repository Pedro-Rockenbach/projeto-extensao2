import { hashSenha } from "../src/app/utils/senha.js";

function lerSenha(mensagem) {
  const entrada = process.stdin;
  if (!entrada.isTTY || typeof entrada.setRawMode !== "function") {
    return Promise.reject(new Error("Execute este comando em um terminal interativo."));
  }

  return new Promise((resolve, reject) => {
    let senha = "";
    const finalizar = (erro) => {
      entrada.setRawMode(false);
      entrada.pause();
      entrada.removeListener("data", receber);
      process.stdout.write("\n");
      if (erro) reject(erro);
      else resolve(senha);
    };

    const receber = (dados) => {
      for (const caractere of dados) {
        if (caractere === "\u0003" || caractere === "\u0004") {
          finalizar(new Error("Operação cancelada."));
          return;
        }
        if (caractere === "\r" || caractere === "\n") {
          finalizar();
          return;
        }
        if (caractere === "\u007f" || caractere === "\b") {
          const caracteres = [...senha];
          if (caracteres.length) {
            caracteres.pop();
            senha = caracteres.join("");
            process.stdout.write("\b \b");
          }
          continue;
        }
        if (caractere >= " " && Buffer.byteLength(senha + caractere, "utf8") <= 1024) {
          senha += caractere;
          process.stdout.write("*");
        }
      }
    };

    process.stdout.write(mensagem);
    entrada.setEncoding("utf8");
    entrada.setRawMode(true);
    entrada.resume();
    entrada.on("data", receber);
  });
}

try {
  const senha = await lerSenha("Nova senha (mínimo 12 caracteres): ");
  const confirmacao = await lerSenha("Confirme a senha: ");
  if (senha.length < 12) throw new Error("A senha deve ter pelo menos 12 caracteres.");
  if (senha !== confirmacao) throw new Error("As senhas não coincidem.");

  console.log(await hashSenha(senha));
} catch (erro) {
  console.error(erro.message);
  process.exitCode = 1;
}
