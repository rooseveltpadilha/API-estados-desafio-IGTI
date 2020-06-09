import express from 'express';
const router = express.Router();
import path from 'path';

import fs from 'fs';

let writeFile = fs.promises.writeFile;
let readFile = fs.promises.readFile;

router.get('/get/:sigla', async (req, res) => {
  try {
    let cidades = await readFile(path.join(process.cwd(), `estados/${req.params.sigla}.json`), "utf8");
    let cidadesJSON = JSON.parse(cidades);
    res.send(`Existe ${cidadesJSON.length} cidades no estado ${cidadesJSON[0].nomeEstado}.`);
  } catch (err) {
    console.log(err);
  }
});

router.get('/maisestados', function (req, res) {
  let ordenadoMais = global.cidadeEstado.sort((a, b) => {
    return b.quantidade - a.quantidade;
  });

  let sliced = ordenadoMais.slice(0, 5);

  res.send(sliced)
});

router.get('/menosestados', (_, res) => {
  let ordenadoMais = global.cidadeEstado.sort((a, b) => {
    return a.quantidade - b.quantidade;
  });

  let sliced = ordenadoMais.slice(0, 5);

  let ordenadoMais2 = sliced.sort((a, b) => {
    return b.quantidade - a.quantidade;
  });

  res.send(ordenadoMais2)
});

router.get('/:desafio', async (req, res) => {
  try {
    let estados = await readFile(path.join(process.cwd(), `json/estados.json`), "utf8");
    let estadosJSON = JSON.parse(estados);
    let desafio = parseInt(req.params.desafio);
    estadosJSON.forEach(async item => {
      let arquivoEstadoCorrespondente = await readFile(path.join(process.cwd(), `estados/${item.Sigla}.json`), "utf8").catch(err => { console.log(err) });
      let arquivoEstadoCorrespondenteJSON = JSON.parse(arquivoEstadoCorrespondente);

      let sorteado = arquivoEstadoCorrespondenteJSON.sort((a, b) => {

        if (a.Nome.length === b.Nome.length) {
          if (desafio === 6 || desafio === 8) {
            return b.Nome.localeCompare(a.Nome);
          }
          return a.Nome.localeCompare(b.Nome);
        }
        return b.Nome.length - a.Nome.length;
      });

      let objeto = {
        "nomePrimeiro": sorteado[0].Nome,
        "nomeUltimo": sorteado[sorteado.length - 1].Nome,
        "siglaUF": sorteado[0].siglaEstado,
      };


      global.cidadeTamanho.push(objeto);
    });


    let questao = cidadeTamanho.map(item => {
      if (desafio === 5 || desafio === 7) {
        return { "nome": item.nomePrimeiro, "sigla": item.siglaUF };
      } else if (parseInt(desafio) === 6 || desafio === 8) {
        return { "nome": item.nomeUltimo, "sigla": item.siglaUF };
      }
    }).sort((a, b) => {
      if (desafio === 5 || desafio === 7) {

        if (a.nome.length === b.nome.length) {
          return a.nome.localeCompare(b.nome);
        }

        return b.nome.length - a.nome.length;

      } else if (desafio === 6 || desafio === 8) {

        if (a.nome.length === b.nome.length) {
          return a.nome.localeCompare(b.nome);
        }

        return a.nome.length - b.nome.length;

      }
    });

    global.cidadeTamanho = [];

    if (desafio === 7 || desafio === 8) {
      questao = questao[0];
    };

    res.send(questao);

    // switch (req.params.desafio) {
    //   case 7: res.send(questaoSete);
    //   case 8: res.send(questaoOito);
    // }

  } catch (err) {
    console.log(err);
  }
});

export default router;