const express = require("express");
const router = express.Router();

// mongodb user model
const User = require("./../models/User");
const Stadistic = require("./../models/Stadistic");
//let array = ["200", "201", "202", "203", "204", "205", "206", "207"];

// Performance
router.post("/performance", (req, res) => {
  let { userID, state, specialism, hospital, patientID, starts } = req.body;
  userID = userID.trim();
  state = state.trim();
  specialism = specialism.trim();
  hospital = hospital.trim();
  //patientID = patientID.trim();
  starts = starts.trim();

  User.find({ userID })
    .then((result) => {
        if (result.length == 0){
            res.json({
                status: "FAILED",
                message: "El userID no coincide con el de ningun médico",
              });
        } 
        else{
            const newPerformance = new Stadistic({
              userID,
              state: "en-servicio",
              specialism,
              hospital,
              patientID,
              starts,
            });
    
            newPerformance
            .save()
            .then((result) =>{
              res.json({
                status: "SUCCESS",
                message: "Estadistica agregada",
                data: result,
              });
            })
          .catch((err) => {
            res.json({
            status: "FAILED",
            message: "Ha ocurrido un error mientras se registraba la estadistica!",
            });
          });
        }
    })
    .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "Se produjo un error al verificar el id del usuario!",
        });
    });
  });


module.exports = router;


//----------
    /*for (let i = 0; i < patientID.length; i++) {
        let userID = patientID[i];
        User.find( {userID} )
          .then((data) =>{
            if(data.length == 0){
                res.json({
                    status: "FAILED",
                    message: "Algunos pacientes no estan en la base de datos",
                  });
            }
          })
        /*if(User.find({patientID[i]})){
           //count.concat(patientID[i]);
           let count = count+1;
        }
    }*/
    /*User.find({}, {patientID} )
          .then((data) =>{
            if(data.length == 0){
                res.json({
                    status: "FAILED",
                    message: "Algunos pacientes no estan en la base de datos",
                  });
            }
          })*/



 /*
    else{
        res.json({
            status: "FAILED",
            message: patientID[0], //"Error al coincidir patientID con la base de datos",
          });
    }*/
