import React, { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { Link, Outlet } from "react-router-dom";

import crest from '../../assets/uw-crest.svg'
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext";

function BadgerLayout(props) {
    const existingUser = sessionStorage.getItem("loginStatus")
    const [loginStatus, setLoginStatus] = useState(existingUser ? existingUser : null)

    const [chatrooms, setChatrooms] = useState([]);

    useEffect(() => {
        if (!loginStatus) {
            sessionStorage.removeItem('loginStatus')
        } else {
            sessionStorage.setItem('loginStatus', loginStatus)
        }
    }, [loginStatus]);

    useEffect(() => {
        fetch('https://cs571api.cs.wisc.edu/rest/s25/hw6/chatrooms', {
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            }
        }).then(res => res.json()).then(json => {
            setChatrooms(json)
        })
    }, []);

    return (
        <div>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img
                            alt="BadgerChat Logo"
                            src={crest}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        BadgerChat
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        {loginStatus ?
                            <Nav.Link as={Link} to="logout">Logout</Nav.Link> :
                            <>
                                <Nav.Link as={Link} to="login">Login</Nav.Link>
                                <Nav.Link as={Link} to="register">Register</Nav.Link>
                            </>
                        }
                        <NavDropdown title="Chatrooms">
                            {
                                chatrooms.map((chatroom, index) => {
                                    return <NavDropdown.Item key={index} as={Link} to={`chatrooms/${chatroom}`}>{chatroom}</NavDropdown.Item>
                                })
                            }
                        </NavDropdown>
                    </Nav>
                </Container>
            </Navbar>
            <div style={{ margin: "1rem" }}>
                <BadgerLoginStatusContext.Provider value={[loginStatus, setLoginStatus]}>
                    <Outlet />
                </BadgerLoginStatusContext.Provider>
            </div>
        </div>
    );
}

export default BadgerLayout;