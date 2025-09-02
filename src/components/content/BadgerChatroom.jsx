import React, { useEffect, useState, useContext, useRef } from "react"
import { Container, Row, Col, Pagination, Form, Button } from "react-bootstrap";
import BadgerMessage from "./BadgerMessage";
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerChatroom(props) {

    const [messages, setMessages] = useState([]);
    const [page, setPage] = useState(1);
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);
    const curUsername = sessionStorage.getItem("loginStatus")

    const titleRef = useRef();
    const contentRef = useRef();

    const loadMessages = () => {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    function handlePostSubmit(e) {
        e?.preventDefault();

        const title = titleRef.current.value;
        const content = contentRef.current.value;

        if (title === "" || content === "") {
            alert("You must provide both a title and content!");
            return;
        }

        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?chatroom=${props.name}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title, content
            })
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully posted!");
                loadMessages()
            } 
        })
    }

    function handleDelete(id) {
        fetch(`https://cs571api.cs.wisc.edu/rest/s25/hw6/messages?id=${id}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
            },
        })
        .then(res => {
            if (res.status === 200) {
                alert("Successfully deleted the post!");
                loadMessages()
            } 
        })
    }

    useEffect(loadMessages, [props, page]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            loginStatus ? 
            <Form onSubmit={handlePostSubmit}>
                <Form.Label htmlFor="title">Post Title</Form.Label>
                <Form.Control id="title" ref={titleRef}></Form.Control>
                <Form.Label htmlFor="content">Post Content</Form.Label>
                <Form.Control id="content" ref={contentRef}></Form.Control>
                <br/>
                <Button type="submit" onClick={handlePostSubmit}>Create Post</Button>
            </Form> 
            : <p>You must be logged in to post!</p>
        }
        <hr />
        {
            messages.length > 0 ?
                <>
                    {
                    }
                    <Container fluid>
                        <Row>
                            {messages.map((message, index) => <Col xs={12} sm={12} md={6} lg={4} xl={3} key={index}>
                                <BadgerMessage title={message.title} poster={message.poster} content={message.content} created={message.created} userOwn={curUsername === message.poster} deletePost={handleDelete} id={message.id}></BadgerMessage>
                            </Col>)}
                        </Row>
                    </Container>
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination>
            <Pagination.Item active={page === 1} onClick={() => setPage(1)}>1</Pagination.Item>
            <Pagination.Item active={page === 2} onClick={() => setPage(2)}>2</Pagination.Item>
            <Pagination.Item active={page === 3} onClick={() => setPage(3)}>3</Pagination.Item>
            <Pagination.Item active={page === 4} onClick={() => setPage(4)}>4</Pagination.Item>
        </Pagination>
    </>
}
