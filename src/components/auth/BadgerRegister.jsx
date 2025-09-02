import React, {useState, useContext} from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerRegister() {

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [confirmPin, setConfirmPin] = useState("");
    let navigate = useNavigate();

    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

     function handleRegisterSubmit(e) {
        e?.preventDefault();

        if (username === "" || pin === "") {
            alert("You must provide both a username and pin!");
            return;
        }
        const regex = /^\d{7}$/;
        if (!regex.test(pin)) {
            alert("Your pin must be a 7-digit number!");
            return;
        }
        if (pin !== confirmPin) {
            alert("Your pins do not match!");
            return;
        }

        fetch("https://cs571api.cs.wisc.edu/rest/s25/hw6/register", {
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
                alert("The registration was successful.")
                setLoginStatus(username)
                sessionStorage.setItem("loginStatus", username)
                navigate("/")
            } else {
                alert("That username has already been taken!")
            }
        })
    }

    return <>
        <h1>Register</h1>
        <Form>
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control id="username" value={username} onChange={(e) => setUsername(e.target.value)}></Form.Control>
            <Form.Label htmlFor="pin">Pin</Form.Label>
            <Form.Control id="pin" value={pin} type='password' onChange={(e) => setPin(e.target.value)}></Form.Control>
            <Form.Label htmlFor="confirmPin">Confirm Pin</Form.Label>
            <Form.Control id="confirmPin" value={confirmPin} type='password' onChange={(e) => setConfirmPin(e.target.value)}></Form.Control>
            <br/>
            <Button type="submit" onClick={handleRegisterSubmit}>Register</Button>
        </Form>
    </>
}
