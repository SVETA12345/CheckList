import React from 'react'

import {
    Table, 
    TableContainer, 
    TableBody, 
    TableRow, 
    TableCell,
    Paper
  } from "@material-ui/core";

const NotFound = () => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell align="center">ЭЛЕМЕНТОВ НЕ НАЙДЕНО</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default NotFound
