import React from 'react';

import {Toast} from 'react-bootstrap';

function ValidityToast({active, setActive}) {
    return (
        <>
            <Toast style={{display: "block", minWidth: "500px", minHeight: "100px", zIndex:"9999", position: 'absolute', top: "20px", right: "calc(50vw - 250px)"}} onClose={setActive} show={active} delay={5000} autohide>
                <Toast.Header style={{fontSize: "18px"}}>
                    <strong className="mr-auto" style={{color: "red"}}>Предупреждение</strong>
                    <small>сейчас</small>
                </Toast.Header>
                <Toast.Body style={{fontSize: "16px"}}>Весь верхний блок в листе оценки ГИС должен быть заполнен!</Toast.Body>
            </Toast>
        </>
    )
}

export default ValidityToast;