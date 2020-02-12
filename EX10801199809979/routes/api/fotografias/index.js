var express= require('express');
var router = express.Router();

var fileModel = require('../filemodel');

var fotCollection = fileModel.getFotografias();

 /*METODO GET*/
router.get('/', function(req, res){
    res.json({
      "entity":"Fotografias",
      "version":"0.0.1"
    });
  }); 

  router.get('/all', function(req, res){
    fotCollection = fileModel.getFotografias();
    res.json(fotCollection);
  }) 
  
   /*METODO POST*/
  router.post('/new', function(req, res){
    fotCollection = fileModel.getFotografias();
    var newFo = Object.assign(
       {},
       req.body,
       {
           "title": req.body.title,
           "url": req.body.url,
           "thumbnailUrl": req.body.thumbnailUrl,
           "album": req.body.album
       }
    );
    var foExists = fotCollection.find(
      function(o, i){
        return o.id === newFo.id;
      }
    )
    if( ! foExists ){
      fotCollection.push(newFo);
      fileModel.setFotografias(
         fotCollection,
         function(err, savedSuccesfully){
           if(err){
             res.status(400).json({ "error": "Lo sentimos ha ocurrido un error" });
           } else {
             res.json(newFo);  
           }
         }
       );
    } else {
      res.status(400).json({"error":"Lo sentimos ha ocurrido un error"});
    }
  }); 
  /*METODO PUT*/

  router.put('/update/:foId',
  function(req, res){
      fotCollection = fileModel.getFotografias();
      var foIdToModify = req.params.foId;
      var amountToAdjust = parseInt(req.body.ajustar);
      var adjustType = req.body.tipo || 'SUB';
      var adjustHow = (adjustType == 'ADD' ? 1 : -1);
      var modFotografias = {};
      var newFotografiasArray = fotCollection.map(
        function(o,i){
          if( foIdToModify === o.id){
             o.title = adjustType;
             modFotografias = Object.assign({}, o);
          }
          return o;
        }
      ); 
    fotCollection = newFotografiasArray;
    fileModel.setFotografias(
      fotCollection,
      function (err, savedSuccesfully) {
        if (err) {
          res.status(400).json({ "error": "Lo sentimos ha ocurrido un error, No se pudo actualizar" });
        } else {
          res.json(modFotografias);  
        }
      }
    );
  }
);

/*METODO DELETE*/
router.delete(
    '/delete/:fotId',
    function( req, res) {
      fotCollection = fileModel.getFotografias();
      var fotIdToDelete  = req.params.fotId;
      var newFotCollection = fotCollection.filter(
        function(o, i){
          return fotIdToDelete !== o.id;
        }
      ); //filter
      fotCollection = newFotCollection;
      fileModel.setFotografias(
        fotCollection,
        function (err, savedSuccesfully) {
          if (err) {
            res.status(400).json({ "error": "No se pudo eliminar objeto" });
          } else {
            res.json({"newProdsQty":fotCollection.length});
          }
        }
      );
    }
  );
  


  module.exports = router;

  