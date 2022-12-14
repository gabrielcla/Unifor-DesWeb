/*
###################################################################################################
|________________________________| CONFIGURA CONEXÃO AO SERVIDOR |________________________________|
*/

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
|______________________________________| ENDPOINT: Hotel |______________________________________|
*/

// Define tabela e endpoint
const tabela = "hotel"
const endpoint = '/hotel'


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


router.post(endpoint, async function(req, res, next){
    try{
      const customer = req.body;
      const db = await connect();
      res.json(await db.collection(tabela).insertOne(customer));
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})


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