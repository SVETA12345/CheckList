import React, { useState, useEffect } from "react"

import "../../../../pages/styles.css"
import { Line as LineJS } from 'chart.js/auto'
import { Chart }            from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Loading from "../../../../components/Loading/Loading";
import {
    Grid,
    Card,
    CardContent,
    Select,
    MenuItem
  } from "@material-ui/core";
  import {
    BarChart,
    Tooltip,
    YAxis,
    XAxis,
    LabelList
  } from "recharts";
//ticks={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}/>
function CustomBarChart(props) {
  
    const [year, setYear] = useState('2022');
    const [nakopPlan, setNakopPlan]= useState([])
    const lineChartData = {
      labels: props.monthsNakopPlan,
      datasets: [
        {
          type:"line",
          data: props.listNakopPlan,
          label: "Накоп. План",
          borderColor: "#3333ff",
          backgroundColor: '#FFFFFF',
          lineTension: 0.5,
          borderDash: [5, 5],
          pointBackgroundColor: '#3333ff',
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded',
          yAxisID: "First Scale",
          datalabels: {
            display: false,
            align:"top"
        }
        },
        {
          backgroundColor: '#FFFFFF',
          type:"line",
          data: props.listNakopFact,
          label: "Накоп. Факт",
          borderColor: "#FE7B2A",
          lineTension: 0.5,
          borderDash: [5, 5],
          pointBackgroundColor: '#FE7B2A',
          pointRadius: 5,
          pointHoverRadius: 10,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded',
          yAxisID: "First Scale",
          datalabels: {
            display:false,
            align:"top"
        }
        },
        {
          type:"bar",
          data: props.plan,
          label: "План",
          borderColor: "#3333ff",
          backgroundColor: '#3333ff',
          yAxisID: "Second Scale",
          datalabels: {
            color: 'white',
            display: function(context) {
              return context.dataset.data[context.dataIndex] > 15;
          },
            zIndex: 100000,
            fontWeight:700
        }
        },
        {
          type:"bar",
          data: props.fact,
          label: "Факт",
          backgroundColor: "#FE7B2A",
          yAxisID: "Second Scale",
          datalabels: {
            color: 'black',
            display: function(context) {
              return context.dataset.data[context.dataIndex] > 15;
          },
            zIndex: 100000,
        }
        },
      ]
    };
    const plugins=[ChartDataLabels]
    const options ={
      plugins:{
        datalabels: {
          display: function(context) {
              return context.dataset.data[context.dataIndex] > 15;
          },},
      legend: {
        display: true,
        position: 'bottom',
  
        fontSize: '20px'

    },
    
  
  
  }
    }
    return (
      
        <Grid item xs={12}>
          <Card sx={{width: "100%"}}>
            <CardContent>
            <Grid container>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <p style={{fontSize: "25px", marginTop: "1rem"}}>{props.title}</p>
              </Grid>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center"}}>
              <Chart ref={props.chartRefPlan}
                data={lineChartData}
                plugins={plugins}
                options={options}
    />
              </Grid>
            </Grid>
            </CardContent>
          </Card>
        </Grid>
    )
    
}

export default CustomBarChart