import React from "react"
import {headerPanelStyle, summaryContainer} from "./styles"

import {
    Typography,
    Accordion,
    AccordionDetails,
    AccordionSummary
} from "@material-ui/core";
import {
    ExpandMore as ExpandMoreIcon
  } from "@material-ui/icons";

function CustomAccordion(props) {
    return (
            <Accordion expanded={props.expanded === props.panelNum} onChange={props.handleChange(props.panelNum)}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={props.panelNum + "bh-content"}
                id={props.panelNum + "bh-header"}
                >
                <div style={summaryContainer}>
                    {props.icon}
                    <Typography style={headerPanelStyle}>{props.name}</Typography>
                </div>
                </AccordionSummary>
                <AccordionDetails style={{margin: 0, padding: 0}}>
                <Typography style={{fontSize: "24px", width: "100%"}}>
                    {props.text}
                </Typography>
                </AccordionDetails>
            </Accordion>
    )
}

export default CustomAccordion