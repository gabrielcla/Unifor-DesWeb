/*
Colunas:
    > ID_usuario (Obrigatório ter)
	> Numero
	> cvc
	> vencimento
	> Nome titular
	> CPF titular
*/

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
|______________________________________| ENDPOINT: usuario |______________________________________|
*/

// Define tabela e endpoint
const tabela = "cartao"
const endpoint = '/cartao'


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

// POST - Só adiciona se fornecer um id_usuario
router.post(endpoint, async function(req, res, next){
    try{
        const customer = req.body; // JSON com a requisição 
        const id_usuario = customer['id_usuario'];
        const db = await connect();

        // Se for passado um id_usuario como parâmetro
        if(id_usuario)
            // Se existir alguem na tabela usuario com o id de id_usuario
            if (await db.collection("usuario").findOne({_id: id_usuario}))
                // Adiciona novo cartão
                res.json(await db.collection(tabela).insertOne(customer));
            else
                res.send("ERRO: Forneça um id_usuário válido");
        else
            res.send("ERRO: Forneça um id_usuário");    
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