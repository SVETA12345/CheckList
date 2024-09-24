import React from 'react';

import {Toast} from 'react-bootstrap';

function ErrorToast({active, setActive, statusError}) {
    return (
        <>
            <Toast style={{display: "block", minWidth: "500px", minHeight: "100px", zIndex:"9999", position: 'absolute', top: "20px", right: "calc(50vw - 250px)"}} onClose={setActive} show={active} delay={5000} autohide>
                <Toast.Header style={{fontSize: "18px"}}>
                    <strong className="mr-auto" style={{color: "red"}}>Ошибка</strong>
                    <small>сейчас</small>
                </Toast.Header>
                <Toast.Body style={{fontSize: "16px", color:"red"}}>Что-то пошло не так. Статус ошибки {statusError}</Toast.Body>
            </Toast>
        </>
    )
}

export default ErrorToast;