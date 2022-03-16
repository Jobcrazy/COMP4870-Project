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

const CostDualAxes = (props) => {
  const data = props.data;
  const config = {
    data: [data, data],
    xField: "time",
    yField: ["Expense", "Budget"],
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

const Category = (props) => {
  const data = props.data;
  const config = {
    data,
    xField: "amount",
    yField: "note",
    seriesField: "note",
    legend: false,
  };
  return <Bar {...config} className="barchart" />;
};

class Summary extends React.Component {
  constructor(props) {
    super(props);

    let year = new Date().getFullYear(),
      expenses = [];
    for (let m = 1; m <= 12; m++) {
      //m = m < 10 ? "0" + m : m;
      expenses.push({
        time: year + "-" + m,
        Expense: 0,
        Budget: 0,
      });
    }

    this.state = {
      expenses,
      category: [],
    };

    this.loadExpenses = this.loadExpenses.bind(this);
    this.loadBudgets = this.loadBudgets.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
  }

  componentDidMount() {
    window.document.title = "Summary - Money Guardian";

    let action = {
      type: "setMenuItem",
      value: ["/main/summary"],
    };
    store.dispatch(action);

    this.loadExpenses();
    this.loadBudgets();
    this.loadCategory();
  }

  async loadExpenses() {
    this.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "api/Expense/monthly",
        params: {
          token: Utils.getToken(),
        },
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      let tmpExpenses = [...this.state.expenses];
      for (let index in result.data.data) {
        for (let monthIndex in tmpExpenses) {
          if (result.data.data[index].note === tmpExpenses[monthIndex].time) {
            tmpExpenses[monthIndex].Expense = result.data.data[index].amount;
          }
        }
      }

      this.setState({
        expenses: tmpExpenses,
      });
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  async loadBudgets() {
    this.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "api/Goal/all",
        params: {
          token: Utils.getToken(),
        },
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      let tmpExpenses = [...this.state.expenses];
      for (let index in result.data.data) {
        for (let monthIndex in tmpExpenses) {
          let date = Utils.dateFtt(
            "yyyy-M",
            Utils.cSharpDateToJsData(result.data.data[index].date)
          );
          if (date === tmpExpenses[monthIndex].time) {
            tmpExpenses[monthIndex].Budget = result.data.data[index].amount;
          }
        }
      }

      this.setState({
        expenses: tmpExpenses,
      });
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  async loadCategory() {
    this.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "api/Expense/category",
        params: {
          token: Utils.getToken(),
        },
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      console.log(result.data.data)

      this.setState({
        category: result.data.data,
      });
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
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
          <CostDualAxes data={this.state.expenses} />
        </Row>

        <Row>
          <Category data={this.state.category}/>
        </Row>
      </>
    );
  }
}

export default Summary;
