import React from "react";
import { Row, Form, Col, Input, Button, message } from "antd";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import "./Summary.css";

class Password extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        window.document.title = "Summary - Money Guardian";

        let action = {
            type: "setMenuItem",
            value: ["/main/summary"],
          };
          store.dispatch(action);
    }

    setLoading(bLoading) {
        let action = {
            type: "setLoading",
            value: bLoading,
        };

        store.dispatch(action);
    }

    render() {
        return (
            <>Summary</>
        );
    }
}

export default Password;
