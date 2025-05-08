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

    const [loading, setLoading] = useState(true);
    
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
            setLoading(false);
            
            console.log("Datos cargados correctamente");
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    };

    useEffect(() => {
        console.log("Iniciando carga de datos...");
        cargarDatos();
    }, []);

    return (
        <>
            <Breadcrumb pageName="Estadísticas" />
            <div className="grid grid-cols-12 gap-2 md:gap-6 2xl:gap-7.5">
                <ChartArea
                    title="Resultados Logrados vs Errores Anuales"
                    categories={logradosVsErrores.categories}
                    seriesData={logradosVsErrores.seriesData}
                    colors={['#FF5733', '#33FF57']}
                    legendPosition="top"
                    loading={loading}
                />
                <ChartBar
                    title="Evaluaciones por nivel de alteración mensual"
                    categories={alteracionNivel.categories}
                    seriesData={alteracionNivel.seriesData}
                    colors={['#33FF57', '#5733FF', '#FF5733']}
                    legendPosition="top"
                    loading={loading}
                />
                
                <ChartBar
                    title="Frecuencia de trastornos detectados mensual"
                    categories={trastornoFrecuencia.categories}
                    seriesData={trastornoFrecuencia.seriesData}
                    colors={['#FF33A1', '#33FF57', '#5733FF', '#FF5733']}
                    legendPosition="top"
                    horizontal={false}
                    loading={loading}
                />
                
                <ChartDonut
                    series={alteracionDistribucion.series}
                    labels={alteracionDistribucion.labels}
                    colors={['#3357FF', '#FF33A1', '#8a8b8b', '#FF5733', '#33FF57']}
                    title="Distribución de alteraciones mensual"
                    loading={loading}
                />
                
                <ChartBar
                    title="Top Fonemas con errores mensual"
                    categories={topFonemaErrores.categories}
                    seriesData={topFonemaErrores.seriesData}
                    colors={['#FF5733', '#33FF57', '#5733FF']}
                    legendPosition="top"
                    loading={loading}
                />
            </div>
        </>
    );
};

export default Estadisticas;