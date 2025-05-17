import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import videoFront1 from "../Tutoriales/videos/Evalingua-Frontend.mp4"
import videoFront2 from "../Tutoriales/videos/Evalingua-Frontend2.mp4"
import videoGame from "../Tutoriales/videos/Evalingua-Game.mp4"


const Tutoriales: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <Breadcrumb pageName="Tutoriales" back/>
            <section className="flex flex-col gap-5 col-span-12 rounded-md border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
                <div className="flex flex-col lg:flex-row gap-3 w-full">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-lg md:text-xl text-primary dark:text-bodydark1">Creación de evaluación</h2>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            En esta sección se explicará cómo iniciar una evaluación desde cero. Para ello, 
                            se debe acceder a la sección de "Pacientes" en el menú lateral izquierdo. Luego, 
                            se debe seleccionar el paciente al que se le desea realizar la evaluación y seleccionar 
                            la acción "Crear evaluación" que tiene un icono de mando de evaluación. A continuación, 
                            se dirige a la ventana de configuración, donde podrá elegir los fonemas a evaluar. 
                            Por ultimo, se da click en "Iniciar evaluación", lo cual le mostrará un QR que debe 
                            escanear desde la interfaz del juego web.
                        </p>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            Para más detalles, consulte el siguiente video
                        </p>
                    </div>
                    <video src={videoFront1} controls className="max-w-3xl h-auto"></video>
                </div>
            </section>
            <section className="flex flex-col gap-5 col-span-12 rounded-md border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-lg md:text-xl text-primary dark:text-bodydark1">Evaluación desde el juego</h2>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            En esta sección se explicará cómo iniciar una evaluación desde el juego. Continuando 
                            desde la sección anterior, una vez escaneado el QR desde el juego, el juego mostrará una pantalla 
                            inicial que indica que el juego esta cargado y listo para iniciar. Luego de esto, se debe brindar el dispositivo 
                            al paciente y este deberá seguir las instrucciones del juego y pronunciar las palabras que se le indican correctamente.
                            Una vez que el paciente haya terminado de pronunciar todas las palabras, el juego mostrará una pantalla de Juego Terminado.
                        </p>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            Para más detalles, consulte el siguiente video
                        </p>
                    </div>
                    <video src={videoGame} controls className="max-w-3xl h-auto"></video>
                </div>
            </section>
            <section className="flex flex-col gap-5 col-span-12 rounded-md border border-stroke bg-white px-5 pt-5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
                <div className="flex flex-col lg:flex-row gap-3">
                    <div className="flex flex-col gap-2">
                        <h2 className="font-bold text-lg md:text-xl text-primary dark:text-bodydark1">Revisión de resultados y estadísticos</h2>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            El siguiente paso es revisar los resultados de la evaluación. Para ello, se debe
                            acceder a la sección de "Evaluaciones" en el menú lateral izquierdo, en esta se visualizarán todas 
                            las evaluaciones realizadas. Al seleccionar una evaluación, se abrirá una pestaña con los resultados de la misma.
                            En esta pestaña se podrá ver el resultado de cada fonema evaluado, así como también los audios recolectados del juego. Regresando a la 
                            sección de "Evaluaciones", podrá descargar un informe en PDF de la evaluación seleccionada. Por otro lado, en la sección de "Estadísticos" se podrá ver un resumen de todas las evaluaciones realizadas, así como también los resultados de cada fonema evaluado.
                        </p>
                        <p className="text-sm md:text-md text-textgray-600 dark:text-textdark text-pretty">
                            Para más detalles, consulte el siguiente video
                        </p>
                    </div>
                    <video src={videoFront2} controls className="max-w-3xl h-auto"></video>
                </div>
            </section>
        </div>
    );
}

export default Tutoriales;