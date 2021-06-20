require('./conexion')

const Product = require('./models/Usuarios');
const Estadistica = require('./models/Estadistica');
const historial = require('./models/Historial');
const Diagnostico = require('./models/Diagnostico');
const Historial = require('./models/Historial');
async function main() {
    const usuario1 = new Product({
         Nombre: 'carlos perez',
         Edad: 35,
         Direccion: 'mz A lt 24 Ov. huandoy',
         UserID: "012",
         EsMedico: false
    })
    const usuario2 = new Product({
        Nombre: 'Ronaldo lopez',
        Edad: 23,
        Direccion: 'mz D lt 31 el olivar, s.m.p',
        UserID: "013",
        EsMedico: true
    })
    const usuario3 = new Product({
        Nombre: 'Maria Aguilar',
        Edad: 21,
        Direccion: 'mz L lt 23 los alisos, los olivos ',
        UserID: "014",
        EsMedico: false
    })
    const estadistica = new Estadistica({
        UserID: "013",
        TiempoDeServicio: new Date(2015,06,11),
        Especialidad: "neurologo",
        Hospital: "cayetano heredia",
        PacienteID: ["012","014"],
        Estrellas: 4
    })
    const historial = new Historial({
        UserID: "013",
        DiagnosticoID: "A01" 
    })
    const diagnostico = new Diagnostico({
        DiagnosticoID: "A01",
        Diagnostico: "presenta una anomalia en la zona izquierda del cerebro, se solicita una operacion de nivel critico",
        FechaDeDiagnostico: new Date(2021,01,13) 
    })
    await usuario1.save();
    await usuario2.save();
    await usuario3.save();
    await estadistica.save();
    await historial.save();
    await diagnostico.save();
  // const productSave = await product.save();
  // return productSave
}
main()
     /*.then(productSave => console.log(productSave))  
       .catch(err => console.log(err)) */