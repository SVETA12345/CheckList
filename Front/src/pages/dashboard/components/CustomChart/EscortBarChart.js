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
  function EscortBarChart(props) {
      var options = {
   
   
        scales: {
            x: {
                stacked: true
            },
            y: {
                stacked: true
            }
        },
    };
      const lineChartData = {
        labels: props.data.month,
        datasets: [
          {
            type:"bar",
            data: props.data.dataAroundClock,
            label: "Количество скважин Круглосуточно",
            borderColor: "#3333ff",
            backgroundColor: '#FF8C00',
            datalabels: {
                color: 'white',
                font: {
                  weight: 'bold',
                  size: 14
              },
                display: function(context) {
                  return context.dataset.data[context.dataIndex] > 10;
              },
                zIndex: 100000,
                fontWeight:900
            }
          },
          {
            type:"bar",
            data: props.data.dataTZ,
            label: "Количество скважин ТЗ",
            backgroundColor: '#F6D106',
            datalabels: {
              color: 'white',
              font: {
                weight: 'bold',
                size: 14
            },
              display: function(context) {
                return context.dataset.data[context.dataIndex] > 10;
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
              <Chart ref={props.chartRefEscort} data={lineChartData} plugins={plugins} options={options}/>
              </Grid>
            </Grid>
            </CardContent>
          </Card>
        </Grid>
    )
    
  }

  export default EscortBarChart