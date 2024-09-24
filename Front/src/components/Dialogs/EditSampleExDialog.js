import React, {useState, useEffect} from 'react';

import {
    Button,
    Dialog, DialogContent, DialogTitle, DialogActions
} from "@material-ui/core";

function EditSampleExDialog({active, setActive}) {
    const [selectedFile, setSelectedFile] = useState();
    const [fileName, setFileName] = useState("");
    const [fileSample, setFileSample] = useState("");
    const constant = false

    function addSample(){
        if (selectedFile) {
            const formData = new FormData();
            formData.append('sample_file', selectedFile);
            fetch(process.env.REACT_APP_API+'sample_file/?format=json',{
                method: 'POST',
                headers:{
                    'Accept':'application/json, text/html',
                    'Authorization': "Token " + localStorage.getItem('id_token')
                },
                body: formData 
            })
        }
        setActive()
    };

    const getLastSample = () => {
        fetch(process.env.REACT_APP_API+'get_sample_file/?format=json', { headers : { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': "Token " + localStorage.getItem('id_token')
         }
      }) 
        .then(response=>response.json())
        .then(data=>{
            setFileSample(data.sample_file)
        })
        .catch(err=> console.log(err))
    }

    const handleFile = (event) => {
        setSelectedFile(event.target.files[0]);
        setFileName(event.target.files[0].name);
    }

    useEffect(() => {
        getLastSample()
    }, [constant])

    return (
        <>
            <Dialog open={active} onClose={setActive} maxWidth="xs" fullWidth>
                <DialogTitle>Шаблоны выгрузки отчетов Excel</DialogTitle>
                    <DialogContent>
                        Последний шаблон:
                        <Button
                            variant="contained"
                            component="label"
                            style={{width:"100%", fontSize:"20px", marginBottom: "1rem", marginTop: "1rem"}}
                            color={fileSample ? "#3CD4A0" : "primary"}
                            disabled={!fileSample}
                            onClick={() => window.open(fileSample.slice(fileSample.indexOf("/dj")), '_blank')}
                            >
                            {fileSample ? "Скачать" : "Файл не найден"}
                        </Button>
                        <Button
                            variant="contained"
                            component="label"
                            style={{width:"100%", fontSize:"20px"}}
                            color={fileName ? "#3CD4A0" : "primary"}
                            >
                            {fileName ? fileName : "Загрузить новый файл"}
                            <input
                                id="add-file"
                                type="file"
                                hidden
                                onChange={handleFile}
                            />
                        </Button>
                    </DialogContent>
                <DialogActions>
                    <Button onClick={() => addSample()} style={{outline: "none"}}>Сохранить</Button>
                </DialogActions>
            </Dialog>   
        </>
    )
}

export default EditSampleExDialog;