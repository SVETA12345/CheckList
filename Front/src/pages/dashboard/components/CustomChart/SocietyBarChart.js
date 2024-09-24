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
  function SocietyBarChart(props) {
      var options = {
        layout:function(context){
            return context
        },
   
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
        labels: props.month,
        datasets: [
          {
            type:"bar",
            data: props.data["ООО «РН-Юганскнефтегаз»"],
            label: "ООО «РН-Юганскнефтегаз»",
            backgroundColor: '#FF8C00',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["ООО «РН-Пурнефтегаз»"],
            label: "ООО «РН-Пурнефтегаз»",
            backgroundColor: '#F89915',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["АО «Тюменнефтегаз»"],
            label: "АО «Тюменнефтегаз»",
            borderColor: "#F0E68C",
            backgroundColor: '#F0E68C',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["АО «РОСПАН ИНТЕРНЕШНЛ»"],
            label: "АО «РОСПАН ИНТЕРНЕШНЛ»",
            backgroundColor: '#AE0000',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["АО «Верхнечонскнефтегаз»"],
            label: "АО «Верхнечонскнефтегаз»",
            backgroundColor: '#FE7B2A',
            lineTension: 0.5,
            borderDash: [5, 5],
            
          },
          {
            type:"bar",
            data: props.data["АО «Сибнефтегаз»"],
            label: "АО «Сибнефтегаз»",
            backgroundColor: '#F6D106',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["АО «НК «Конданефть»"],
            label: "АО «НК «Конданефть»",
            backgroundColor: '#95A0B2',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data['ООО "АнгараНефть"'],
            label: 'ООО "АнгараНефть"',
            borderColor: "#FF6347",
            backgroundColor: '#FF6347',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
          {
            type:"bar",
            data: props.data["АО «Востсибнефтегаз»"],
            label: "АО «Восточно-Сибирская нефтегазовая компания»",
            backgroundColor: '#C93D00',
            lineTension: 0.5,
            borderDash: [5, 5],
          },
        ]}
        const plugins=[]
    return (
        <Grid item xs={12}>
          <Card sx={{width: "100%"}}>
            <CardContent>
            <Grid container>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center", alignItems: 'center'}}>
                <p style={{fontSize: "25px", marginTop: "1rem"}}>{props.title}</p>
              </Grid>
              <Grid item xs={12} style={{display: "flex", justifyContent: "center"}}>
              <Chart ref={props.chartRefSociety} data={lineChartData} plugins={plugins} options={options}/>
              </Grid>
            </Grid>
            </CardContent>
          </Card>
        </Grid>
    )
    
  }

  export default SocietyBarChart