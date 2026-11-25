import mysql from "mysql2";

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3307,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "sistema_mural",
  dateStrings: true,
  charsetNumber: 45,
});

pool.getConnection((error, conn) => {
  if (error) {
    console.error("Erro ao conectar ao banco:", error.message);
    return;
  }
  console.log("Conectado ao banco de dados MySQL!");
  conn.release();
});

function corrigirUtf8(valor) {
  if (typeof valor === "string" && /[\u00C0-\u00FF][\u0080-\u00BF]/.test(valor)) {
    try {
      return Buffer.from(valor, "latin1").toString("utf8");
    } catch {
      return valor;
    }
  }
  if (Array.isArray(valor)) {
    return valor.map(corrigirUtf8);
  }
  if (valor && typeof valor === "object") {
    return Object.fromEntries(
      Object.entries(valor).map(([k, v]) => [k, corrigirUtf8(v)])
    );
  }
  return valor;
}

export const consulta = (sql, valores = [], mensagemReject = "Erro na consulta") => {
  return new Promise((resolve, reject) => {
    pool.query(sql, valores, (error, result) => {
      if (error) {
        console.error(`${mensagemReject}:`, error.message);
        return reject(error);
      }
      return resolve(corrigirUtf8(JSON.parse(JSON.stringify(result))));
    });
  });
};
