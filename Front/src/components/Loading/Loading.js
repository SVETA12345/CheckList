import React from 'react';

import {
    CircularProgress
} from "@material-ui/core";

const Loading = () => {
    return (
        <div style={{width:"100%", height:"100%",display:"flex", justifyContent: "center", alignItems:"center"}}>
            <CircularProgress size="5rem"/>
        </div>
    )
}

export default Loading;
