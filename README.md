# uniMedic-DB 💾

<p align="center">
  <img align="center" src="diagramaDB.png" alt="uniMedicDB">
</p>

Especificaciones:
- Solo los médicos podrán tener estadísticas
- Un médico tendrá acceso a varios historiales de los pacientes
- Un historial tendrá varios diagnósticos de los pacientes (ordenaodos por fecha)
- El diagnóstico inicial es la salida del chatbot IA, y contiene texto y/o imagen(es)
- Los diagnósticos pueden ser validados o no por un médico
- Los pacientes pueden calificar a los médicos con hasta 5 estrellas
- Los pacientes y médicos pueden descargar el diagnóstico del paciente (en formato PDF)
- Primero se crea el diagnóstico y luego se guarda en la colección Historial

Rutas actuales:

- ✅ User: Signup, Signin
- ✅ Stadistic: Register, Update
- ✅ Historial: Register, Update
- ✅ Diagnosis: Register, Update

TODO:
- ⬜️ Obtener Historial de todos los pacientes (GET)
- ⬜️ Obtener Historial por paciente (GET)
- ⬜️ Obtener todos los Usuarios (GET)
- ⬜️ Obtener Diagnósticos de un determinado Historial de un paciente (GET)
- ⬜️ Obtener Estadísticas de un determinado médico (GET)
- ⬜️ Descargar PDF de diagnóstico por usuario (GET y más)

*Nota*: De momento no hay métodos para borrar (DELETE) documentos (no es necesario)