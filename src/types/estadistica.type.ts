export interface GraficoDTO {
    categories: string[];
    seriesData: {
        name: string;
        data: number[];
    }[];
}

export interface PieChartDTO{
    labels: string[];
    series: number[];
}
