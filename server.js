const express = require("express");
const bodyParser = require("body-parser");
const webpush = require("web-push");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const vapidKeys = {
  publicKey: "BIdsCsBcsnkWE0vnR5y8hWlooxoCk4Dhzu2zJkURcWaXbwZzb5A-7mm1E441r_fIUDQd_APb-JOaBNCIrjxdpZI",
  privateKey: "9hiZR_HQE5n_LCmURztwpp7Zp4ClvVwYX70YLcPo2BQ"
};


webpush.setVapidDetails(
  "mailto:seuemail@exm",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.post("/subscribe", (req, res) => {
  const subscription = req.body;

  const payload = JSON.stringify({
    title: "Notificação do IMTLA",
    body: "Você recebeu uma nova mensagem."
  });

  webpush.sendNotification(subscription, payload).catch(console.error);
  res.status(201).json({});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
