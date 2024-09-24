import React, {useState, useEffect} from 'react';

import {
    Button,
    TextField,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

import {Form} from 'react-bootstrap';

function DensityDialog({active, setActive, density_data, onUpdate}) {
    const role = localStorage.getItem('role');
    const [density, setDensity] = useState(null)
    const [densityData, setDensityData] = useState({});

    function updateValues(e){
        var inputName = e.target.name;
        var inputValue = e.target.value;
        if(inputName === 'density'){
            setDensity(inputValue);
        }
    }

    useEffect(() => {
        setDensityData({
            density: density
        })
    }, [density])

    useEffect(() => {
        setDensity(density_data.density);
    }, [density_data])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="sm" fullWidth>
                <DialogTitle>Плотность данных: точ. на метр</DialogTitle>
                <DialogContent>
                    <Form onSubmit={(e) => {e.preventDefault(); onUpdate(densityData); setActive()}}>
                        <Form.Group>
                            <Form.Label htmlFor="density">Плотность данных: точ. на метр</Form.Label>
                            {density_data.density}
                            <Form.Control
                            disabled={!(role === "user" || role === "superuser")}
                            type="number"
                            id="density"
                            name="density"
                            value={density}
                            onChange={e => updateValues(e)}
                            />
                        </Form.Group>
                    </Form>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {onUpdate(densityData) ;setActive()}} style={{outline: "none", visibility: (role === "user" || role === "superuser" ? 'visible' : 'hidden')}}>Сохранить</Button>
                </DialogActions>
            </Dialog>   
        </>
    )
}

export default DensityDialog;