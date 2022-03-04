import React from "react";
import { Row, Col, Button, message, DatePicker } from "antd";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import "./Summary.css";
import ReactDOM from "react-dom";
import { DualAxes, Bar } from "@ant-design/plots";
import Layout from "antd/lib/layout/layout";
const { RangePicker } = DatePicker;

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
    legend: false,
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
  return <DualAxes {...config} className="barchart" />;
};

const Category = () => {
  const data = [
    {
      year: "1951 年",
      value: 38,
    },
    {
      year: "1952 年",
      value: 52,
    },
    {
      year: "1956 年",
      value: 61,
    },
    {
      year: "1957 年",
      value: 145,
    },
    {
      year: "1958 年",
      value: 48,
    },
  ];
  const config = {
    data,
    xField: "value",
    yField: "year",
    seriesField: "year",
    legend: false
  };
  return <Bar {...config} className="barchart" />;
};

class Summary extends React.Component {
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
        <Row>
          <Col span="18"></Col>
          <Col span="6" style={{ textAlign: "right" }}>
            <RangePicker picker="month" />
          </Col>
        </Row>

        <Row>
          <CostDualAxes />
        </Row>

        <Row>
          <Category />
        </Row>
      </>
    );
  }
}

export default Summary;
