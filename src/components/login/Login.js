import React from "react";
import { Row, Form, Col, Button, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import axios from "axios";
import Utils from "../../common/Utils";
import "./Login.css";
import store from "../../store";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.onFinish = this.onFinish.bind(this);
    this.attachSignin = this.attachSignin.bind(this);

    this.state = {
      img: require("../../assets/loginbg.jpg"),
    };
  }

  componentDidMount() {
    window.document.title = "Money Gardian";

    //this.checkLogin();

    // Init Google Login Button
    let self = this;
    window.gapi.load("auth2", function () {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      self.auth2 = window.gapi.auth2.init({
        client_id:
          "123727176263-q22g4po6p3q2165ht5fsco8957179j8v.apps.googleusercontent.com",
        cookiepolicy: "single_host_origin",
      });
      self.attachSignin(document.getElementById("login"));
    });
  }

  attachSignin(element) {
    // Init Google Login Callback functions
    let self = this;
    self.auth2.attachClickHandler(
      element,
      {},
      function (googleUser) {
        // Login Success, then login to HomeWork
        let profile = self.auth2.currentUser.get().getBasicProfile();
        self.onFinish(profile);
      },
      function (error) {
        console.log(JSON.stringify(error, undefined, 2));
      }
    );
  }

  setLoading(bLoading) {
    let action = {
      type: "setLoading",
      value: bLoading,
    };

    store.dispatch(action);
  }

  onFinish(profile) {
    this.setLoading(true);

    let data = {
      gid: profile.getId(),
      fname: profile.getName(),
      gname: profile.getGivenName(),
      xname: profile.getFamilyName(),
      head: profile.getImageUrl(),
      email: profile.getEmail(),
    };

    Utils.setProfile(data);

    let self = this;
    axios
      .post(Utils.getDomain() + "/api/user/login", data)
      .then(function (res) {
        if (0 === res.data.code) {
          Utils.setToken(res.data.data);

          self.props.history.push("/main");
        } else {
          message.error(res.data.message);
        }
        self.setLoading(false);
      })
      .catch(function (err) {
        message.error(err.message);
        self.setLoading(false);
      });
  }

  checkLogin() {
    let token = Utils.getToken();
    if (!token) {
      return;
    }

    let self = this;
    axios
      .get(Utils.getDomain() + "/api/user/info/" + token)
      .then(function (res) {
        if (0 === res.data.code) {
          self.props.history.push("/main");
        }
      })
      .catch(function (err) {
        message.error(err.message);
      });
  }

  render() {
    return (
      <Row justify="center" align="middle" className="container">
        <Col span={6}>
          <center>
            <h1 className="title">Money Guardian</h1>
          </center>
          <Form name="basic" onFinish={this.onFinish}>
            <Form.Item>
              <Button
                id="login"
                type="primary"
                //htmlType="submit"
                block
                icon={<GoogleOutlined />}
              >
                Sign in with Google
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    );
  }
}

export default Login;
