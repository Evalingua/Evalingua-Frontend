import React, { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ChartArea from "../../components/Charts/ChartArea";
import ChartBar from "../../components/Charts/ChartBar";
import ChartDonut from "../../components/Charts/ChartDonut";
import { EstadisticaService } from "../../services/estadisticas/EstadisticaService";
import { GraficoDTO, PieChartDTO } from "../../types/estadistica.type";

const Estadisticas: React.FC = () => {
    // Crea una sola instancia del servicio fuera de las funciones
    const estadisticasService = new EstadisticaService();
    
    const [trastornoFrecuencia, setTrastornoFrecuencia] = useState<GraficoDTO>({} as GraficoDTO);
    const [alteracionNivel, setAlteracionNivel] = useState<GraficoDTO>({} as GraficoDTO);
    const [alteracionDistribucion, setAlteracionDistribucion] = useState<PieChartDTO>({} as PieChartDTO);
    const [topFonemaErrores, setTopFonemaErrores] = useState<GraficoDTO>({} as GraficoDTO);
    const [logradosVsErrores, setLogradosVsErrores] = useState<GraficoDTO>({} as GraficoDTO);
    
    // Función para cargar todos los datos
    const cargarDatos = async () => {
        try {
            // Usa Promise.all para hacer todas las peticiones en paralelo
            const [
                trastornoFrecuenciaRes,
                alteracionNivelRes,
                alteracionDistribucionRes,
                topFonemaErroresRes,
                logradosVsErroresRes
            ] = await Promise.all([
                estadisticasService.getTrastornoFrecuencia(),
                estadisticasService.getAlteracionNivel(),
                estadisticasService.getAlteracionDistribucion(),
                estadisticasService.getTopFonemaErrores(),
                estadisticasService.getLogradosVsErrores()
            ]);
            
            setTrastornoFrecuencia(trastornoFrecuenciaRes.data);
            setAlteracionNivel(alteracionNivelRes.data);
            setAlteracionDistribucion(alteracionDistribucionRes.data);
            setTopFonemaErrores(topFonemaErroresRes.data);
            setLogradosVsErrores(logradosVsErroresRes.data);
            
            console.log("Datos cargados correctamente");
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    // useEffect con array de dependencias vacío para ejecutarse solo al montar el componente
    useEffect(() => {
        console.log("Iniciando carga de datos...");
        cargarDatos();
        // No es necesario incluir cargarDatos en las dependencias ya que está definido dentro del componente
    }, []);

    return (
        <>
            <Breadcrumb pageName="Estadísticas" />
            <div className="grid grid-cols-12 gap-2 md:gap-6 2xl:gap-7.5">
                {Object.keys(logradosVsErrores).length > 0 ? (
                    <ChartArea
                        title="Resultados Logrados vs Errores Anuales"
                        categories={logradosVsErrores.categories}
                        seriesData={logradosVsErrores.seriesData}
                        colors={['#FF5733', '#33FF57']}
                        legendPosition="top"
                    />
                ) : (
                    <div>Cargando datos de logrados vs errores...</div>
                )}
                {Object.keys(alteracionNivel).length > 0 ? (
                    <ChartBar
                        title="Evaluaciones por nivel de alteración mensual"
                        categories={alteracionNivel.categories}
                        seriesData={alteracionNivel.seriesData}
                        colors={['#33FF57', '#5733FF', '#FF5733']}
                        legendPosition="top"
                    />
                ) : (
                    <div>Cargando datos de alteración por nivel...</div>
                )}
                
                {Object.keys(trastornoFrecuencia).length > 0 ? (
                    <ChartBar
                        title="Frecuencia de trastornos detectados mensual"
                        categories={trastornoFrecuencia.categories}
                        seriesData={trastornoFrecuencia.seriesData}
                        colors={['#FF33A1', '#33FF57', '#5733FF', '#FF5733']}
                        legendPosition="top"
                        horizontal={false}
                    />
                ) : (
                    <div>Cargando datos de frecuencia de trastornos...</div>
                )}
                
                {Object.keys(alteracionDistribucion).length > 0 ? (
                    <ChartDonut
                        series={alteracionDistribucion.series}
                        labels={alteracionDistribucion.labels}
                        colors={['#3357FF', '#FF33A1', '#8a8b8b', '#FF5733', '#33FF57']}
                        title="Distribución de alteraciones mensual"
                    />
                ) : (
                    <div>Cargando datos de distribución de alteraciones...</div>
                )}
                
                {Object.keys(topFonemaErrores).length > 0 ? (
                    <ChartBar
                        title="Top Fonemas con errores mensual"
                        categories={topFonemaErrores.categories}
                        seriesData={topFonemaErrores.seriesData}
                        colors={['#FF5733', '#33FF57', '#5733FF']}
                        legendPosition="top"
                    />
                ) : (
                    <div>Cargando datos de fonemas con errores...</div>
                )}
            </div>
        </>
    );
};

export default Estadisticas;