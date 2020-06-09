import express from "express";
import fs from "fs";
import estadosRouter from "../routes/estados.mjs";
import path from 'path';
import cors from 'cors'

const app = express(),
  writeFile = fs.promises.writeFile,
  readFile = fs.promises.readFile,
  port = 3000;

global.fileEstados = "./json/estados.json";
global.fileCidades = "./json/cidades.json";
global.pastaEstados = "./../estados/";
global.cidadeEstado = [];
global.cidadeTamanhoNome = [];
global.cidadeTamanho = [];

app.use(express.json());
app.use('/estados', estadosRouter)
app.use(cors());

app.listen(port, async () => {
  try {
    let cidades = await readFile(global.fileCidades, "utf8");
    let estados = await readFile(global.fileEstados, "utf8");

    let estadosJSON = JSON.parse(estados);
    let cidadesJSON = JSON.parse(cidades);


    estadosJSON.forEach(async estado => {
      let cidadesDoEstadoAtual = [];

      cidadesJSON.forEach(cidade => {
        if (estado.ID === cidade.Estado) {
          cidade.nomeEstado = estado.Nome;
          cidade.siglaEstado = estado.Sigla;
          cidadesDoEstadoAtual.push(cidade);

          let objCidade = { nome: cidade.Nome, tamanho: cidade.Nome.length, estado: estado.Sigla };
          cidadeTamanhoNome.push(objCidade);
        }
      });
      // console.log(cidadesDoEstadoAtual);
      let fileNameState = estado.Sigla + '.json';

      let estadoQuantidade = { nome: estado.Sigla, quantidade: cidadesDoEstadoAtual.length };
      cidadeEstado.push(estadoQuantidade);
      await writeFile(path.join(process.cwd(), `estados/${fileNameState}`), JSON.stringify(cidadesDoEstadoAtual), { flag: "wx", codification: "utf8" }).catch(err => {
        if (!err.code === "EEXIST") {
          console.log(err);
        }
      });
    });

    console.log(`Server inicialized at ${port}`);
  } catch (err) {
    console.log(err);
  }
});