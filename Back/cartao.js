// Define Banco de Dados
const bdados = "StarsHotel"

// Define Tabela | Endpoint
const tabela = "cartao"


/*
###################################################################################################
|_________________________________________________________________________________________________|

Colunas:
    > id_usuario        (Obrigatório)
	- numero
	- cvc
	- vencimento
	- nome titular
	- cpf titular


###################################################################################################
|________________________________| CONFIGURA CONEXÃO AO SERVIDOR |________________________________|
*/

// Conecta ao servidor com o banco de dados
const {MongoClient, ObjectId} = require("mongodb");
async function connect() {
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
|___________________________________________| MÉTODOS |___________________________________________|
*/

// GET 
router.get('/'+tabela +'/:id?', async function(req, res, next) {
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

// POST - Só adiciona se fornecer na requisição id_usuario válido
router.post('/'+tabela, async function(req, res, next){
    try{
        const customer = req.body; // JSON com a requisição 
        const id_usuario = customer['id_usuario'];
        const db = await connect();

        // Se for passado id_usuario válido como parâmetro na requisição, adiciona o elemento a tabela
        if (id_usuario) {
            try {
                if (await db.collection("usuario").findOne({_id: new ObjectId(id_usuario)})) {
                    res.json(await db.collection(tabela).insertOne(customer));
                } else {
                    res.send("ERRO: Não existe usuário com o id_usuario fornecido!");
                }
            } catch {
                res.send("ERRO: id_usuario Inválido!");
            }
        } else {
            res.send("ERRO: Forneça id_usuario!");    
        }
    }
    catch(ex){
      console.log(ex);
      res.status(400).json({erro: `${ex}`});
    }
})

// PUT
router.put('/'+tabela+'/:id', async function(req, res, next){
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
router.delete('/'+tabela+'/:id', async function(req, res, next){
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

app.use('/', router); 

//inicia o servidor
app.listen(port);
console.log('API funcionando!');