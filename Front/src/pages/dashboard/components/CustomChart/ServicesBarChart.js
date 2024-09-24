import React, { useState, useEffect } from "react"

import "../../../../pages/styles.css"
import { Line as LineJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
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
function ServicesBarChart(props) {
    const datasetsService = []
    const keys = Object.keys(props.data.services)
    for (var i = 0, l = keys.length; i < l; i++) {
        datasetsService.push(
            {
                type: "bar",
                data: props.data.services[keys[i]],
                label: keys[i],
                borderColor: "#3333ff",
                backgroundColor: '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase(),
                datalabels: {
                    color: 'white',
                    font: {
                        weight: 'bold',
                        size: 14
                    },
                    display: function (context) {
                        return context.dataset.data[context.dataIndex] > 10;
                    },
                    zIndex: 100000,
                    fontWeight: 900
                }
            },
        )

    }
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
        datasets: datasetsService
    }
    const plugins = [ChartDataLabels]
    return (
        <Grid item xs={12}>
            <Card sx={{ width: "100%" }}>
                <CardContent>
                    <Grid container>
                        <Grid item xs={12} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <p style={{ fontSize: "25px", marginTop: "1rem" }}>{props.title}</p>
                        </Grid>
                        <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                            <Chart ref={props.chartRefServices} data={lineChartData} plugins={plugins} options={options} />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Grid>
    )

}

export default ServicesBarChart