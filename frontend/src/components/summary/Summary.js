import React from "react";
import { Row, Form, Col, Input, Button, message } from "antd";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import "./Summary.css";
import ReactDOM from "react-dom";
import { DualAxes } from "@ant-design/plots";

const CostDualAxes = () => {
  const data = [
    {
      time: "2019-03",
      value: 350,
      count: 800,
    },
    {
      time: "2019-04",
      value: 900,
      count: 600,
    },
    {
      time: "2019-05",
      value: 300,
      count: 400,
    },
    {
      time: "2019-06",
      value: 450,
      count: 380,
    },
    {
      time: "2019-07",
      value: 470,
      count: 220,
    },
  ];
  const config = {
    data: [data, data],
    xField: "time",
    yField: ["value", "count"],
    geometryOptions: [
      {
        geometry: "column",
      },
      {
        geometry: "line",
        lineStyle: {
          lineWidth: 2,
        },
      },
    ],
  };
  return <DualAxes {...config} />;
};

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
      <>
        <CostDualAxes />
      </>
    );
  }
}

export default Password;
