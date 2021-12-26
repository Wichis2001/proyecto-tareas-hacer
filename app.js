require('colors');
const { guardarDB, leerDB } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar, mostrarListadoChecklist} = require('./helpers/inquirer');
const Tareas = require('./models/tareas');

console.clear();

const main =async()=>{
   
    let opt='';
    const tareas=new Tareas();
    const tareasDB= leerDB();

    if(tareasDB){
        //Establecer las tareas
        tareas.cargarTareasFromArray(tareasDB);
    }
    do{
        //Imprimir el menú
        opt=await inquirerMenu()
        
        switch (opt) {
            case '1':
                //Crear opcion
                const desc= await leerInput('Descripción:');
                tareas.crearTarea(desc);
            break;
            case '2':
                //Listado Opciones
                if(tareas.listadoArr.length>0){
                    tareas.listadoCompleto();
                } else {
                    console.log('\n');
                    console.log('NO hay tareas registradas en la DB'.red);
                }        
            break;
            case '3':
                //Listar tareas Completadas
                if(tareas.listadoArr.length>0){
                    tareas.listarPendientesCompletadas(true);
                } else {
                    console.log('\n');
                    console.log('NO hay tareas registradas en la DB'.red);
                }      
            break;
            case '4':
                //Listar tareas Pendientes
                if(tareas.listadoArr.length>0){
                    tareas.listarPendientesCompletadas(false);
                } else {
                    console.log('\n');
                    console.log('NO hay tareas registradas en la DB'.red);
                }     
            break;
            case '5':
                //Completar Tareas
                if(tareas.listadoArr.length>0){
                    const ids = await mostrarListadoChecklist(tareas.listadoArr);
                    tareas.toggleCompletadas(ids);
                } else {
                    console.log('\n');
                    console.log('NO hay tareas registradas en la DB'.red);
                }  
            break
            case '6':
                //Borrar Tarea
                if(tareas.listadoArr.length>0){
                    const id = await listadoTareasBorrar(tareas.listadoArr);
                    if(id!=='0'){
                        const ok= await confirmar('¿Está seguro?'); 
                        if(ok){
                            tareas.borrarTarea(id);
                            console.log('\n');
                            console.log('Tarea Borrada'.red);
                        }
                    }        
                } else {
                    console.log('\n');
                    console.log('NO hay tareas registradas en la DB'.red);
                }          
            break;
        }
     
        guardarDB(tareas.listadoArr);

        await pausa();

    } while(opt!=='0');
    
    //pausa();
}

main();