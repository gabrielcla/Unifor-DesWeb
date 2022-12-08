// Define Banco de Dados
const bdados = "StarsHotel"

// Conecta ao servidor com o banco de dados
const {MongoClient, ObjectId} = require("mongodb");
async function connect(){
  if(global.db) return global.db;
    const conn = await MongoClient.connect("mongodb+srv://admin:WktJ1MdhrUdoxWhz@back-end.zhcmjev.mongodb.net/?retryWrites=true&w=majority");
  if(!conn) return new Error("Can't connect");
    global.db = await conn.db(bdados);
  return global.db;
}

const express = require('express');
const app = express();         
const port = 3000; //porta padrão

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Definindo as rotas
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Funcionando!' }));


/*
###################################################################################################
|______________________________________| ENDPOINT: usuario |______________________________________|
*/

// Define tabela e endpoint
const tabela = "quarto"
const endpoint = '/quarto'


// GET 
router.get(endpoint+'/:id?', async function(req, res, next) {
    try{
      const db = await connect();
      if(req.params.id) // Se o id foi passado como parâmetro retorna 
        res.json(await db.collection(tabela).findOne({_id: new ObjectId(req.params.id)}));
      else
        res.json(await db.collection(tabela).find().toArray());
    }
    catch(ex){
        console.log(ex);
        res.status(400).json({erro: `${ex}`});
    }
})

// POST - Só adiciona se fornecer um id_hotel
router.post(endpoint, async function(req, res, next){
    try{
        const customer = req.body; // JSON com a requisição 
        const id_hotel = customer['id_hotel'];
        const db = await connect();

        // Se for passado id_hotel válido como parâmetro na requisição, adiciona o elemento a tabela
        if (id_hotel) {
          try {
              if (await db.collection("hotel").findOne({_id: new ObjectId(id_hotel)})) {
                  res.json(await db.collection(tabela).insertOne(customer));
              } else {
                  res.send("ERRO: Não existe usuário com o id_hotel fornecido!");
              }
          } catch {
              res.send("ERRO: id_hotel Inválido!");
          }
      } else {
          res.send("ERRO: Forneça id_hotel!");    
      }
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// PUT
router.put(endpoint+'/:id', async function(req, res, next){
    try{
      const customer = req.body;
      const db = await connect();
      res.json(await db.collection(tabela).updateOne({_id: new ObjectId(req.params.id)}, {$set: customer}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// DELETE
router.delete(endpoint+'/:id', async function(req, res, next){
    try{
      const db = await connect();
      res.json(await db.collection(tabela).deleteOne({_id: new ObjectId(req.params.id)}));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})



/*
###################################################################################################
|_______________________________________| INICIA SERVIDOR |_______________________________________|
*/

app.use('/', router); // Sem isso dá erro

//inicia o servidor
app.listen(port);
console.log('API funcionando!');