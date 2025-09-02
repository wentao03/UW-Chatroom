import React, {useRef, useContext} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    const usernameRef = useRef();
    const pinRef = useRef();

    let navigate = useNavigate();

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    function handleLoginSubmit(e) {
        e?.preventDefault();

        const username = usernameRef.current.value;
        const pin = pinRef.current.value;

        if (username === "" || pin === "") {
            alert("You must provide both a username and pin!");
            return;
        }
        const regex = /^\d{7}$/;
        if (!regex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username, pin
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("The login was successful.");
                setLoginStatus(username)
                sessionStorage.setItem("loginStatus", username)
                navigate("/")
            } else {
                alert("Incorrect username or pin!")
            }
        })
    }

    return <>
        <h1>Login</h1>
        <Form onSubmit={handleLoginSubmit}>
            <Form.Label htmlFor="usernameInput">Username</Form.Label>
            <Form.Control id="usernameInput" ref={usernameRef}></Form.Control>
            <Form.Label htmlFor="pinInput">Pin</Form.Label>
            <Form.Control id="pinInput" type="password" ref={pinRef}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleLoginSubmit}>Login</Button>
        </Form>
    </>
}
