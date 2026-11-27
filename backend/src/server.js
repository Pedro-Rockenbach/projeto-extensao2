// Carrega o .env antes de qualquer outro módulo ler process.env
import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando no endereço http://localhost:${PORT}`);
});
