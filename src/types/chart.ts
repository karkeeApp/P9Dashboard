export interface ChartOpt {
  w: {
    globals: {
      series: string;
    };
  };
  seriesIndex: number;
  dataPointIndex: number;
}

export interface PieChartOpt {
  globals: {
    seriesTotals: number[];
  };
}
