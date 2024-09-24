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
  function OperationsBarChart(props) {
    
      var options = {
        layout: {
            padding: {
                left: 30,
                right: 30,
                top: 30,
                bottom: 30
            }
        },
        plugins:{
          legend: {
            display: false,
    
        },
        htmlLegend: {
            // ID of the container to put the legend in
            containerID: 'legend-container',
          },
      }
    };
      const lineChartData = {
        labels: props.data.years,
        datasets: [
          {
            type:"bar",
            data: props.data.countWells,
            label: "Всего скважин",
            borderColor: "#3333ff",
            backgroundColor: function (context) {
                if (context.dataset.data[context.dataIndex]<=1150) return "red"
                else if (context.dataset.data[context.dataIndex] <= 1250) return "yellow"
                else return "green";
        },
            lineTension: 0.5,
            borderDash: [5, 5],
            pointBackgroundColor: '#3333ff',
            pointRadius: 5,
            pointHoverRadius: 10,
            pointHitRadius: 30,
            pointBorderWidth: 2,
            pointStyle: 'rectRounded',
            datalabels: {
                anchor: 'end',
                align: 'top',
                color: 'black',
                font: {
                    weight: 'bold',
                    size: 14
                },
                display: function(context) {
                  return context.dataset.data[context.dataIndex] > 4;
              },
                zIndex: 100000,
                fontWeight:900
            }
          },
          
        ]}
        const plugins=[ChartDataLabels]
    return (
        <Grid item xs={12}>
          <Card sx={{width: "100%"}}>
            <CardContent>
            <Grid container>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <p style={{fontSize: "25px", marginTop: "1rem"}}>{props.title}</p>
              </Grid>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center"}}>
              <Chart ref={props.chartRefOperations} data={lineChartData} plugins={plugins} options={options}>
              </Chart>
              </Grid>
            </Grid>
            <div style={{display:'flex'}}>
            <p><span style={{fontWeight:"900"}}> Всего скважин</span> 1,05 тыс.</p>
            <div style={{background: 'linear-gradient(to right, red, yellow, green)',
 width: '100px',
 height: '20px'}}>
 <div style={{marginLeft:'calc(50%)', width:'1px', height:'calc(100%)', background:"black"}}></div>
 <p style={{marginLeft:'calc(30%)'}}>1,2 тыс.</p>
 </div>
 <p>1,35 тыс.</p>
 </div>
            </CardContent>
          </Card>
        </Grid>
    )
    
  }

  export default OperationsBarChart