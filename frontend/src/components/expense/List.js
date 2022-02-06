import React from "react";
import {
  Row,
  Col,
  Table,
  message,
  Button,
  Space,
  DatePicker,
  Popconfirm,
} from "antd";
import axios from "axios";
import { PlusSquareOutlined } from "@ant-design/icons";
import "./List.css";
import store from "../../store";
import moment from "moment";
import Utils from "../../common/Utils";

const { RangePicker } = DatePicker;

class ContractList extends React.Component {
  constructor(props) {
    super(props);

    this.onTableTitle = this.onTableTitle.bind(this);
    this.onDateChange = this.onDateChange.bind(this);

    this.columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Cost",
        dataIndex: "cost",
        key: "cost",
      },
      {
        title: "Category",
        dataIndex: "category",
        key: "category",
      },
      {
        title: "Note",
        dataIndex: "note",
        key: "note",
      },
      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: "150px",
        render: (text, record) => (
          <Space>
            <Button size="small">Edit</Button>
            <Popconfirm
              placement="left"
              title="Are you sure to delete this row?"
              onConfirm={() => this.handleDelete(record.id)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    this.state = {
      dataSource: [],
      date: new Date(),
    };
  }

  handleDelete = (id) => {
    this.setLoading(true);

    let self = this;
    axios
      .delete("/api/timesheet/token/" + Utils.getToken() + "/id/" + id)
      .then(function (res) {
        self.setLoading(false);
        if (1 === res.data.code) {
          self.props.history.push("/login");
        } else if (0 === res.data.code) {
          const dataSource = [...self.state.dataSource];

          for (let n = 0; n < dataSource.length; ++n) {
            if (id == dataSource[n].id) {
              dataSource.splice(n, 1);
              break;
            }
          }

          self.setState({
            dataSource: dataSource,
          });
        } else {
          message.error(res.data.message);
        }
      })
      .catch(function (err) {
        self.setLoading(false);
        message.error(err.message);
      });
  };

  render() {
    return (
      <Table
        dataSource={this.state.dataSource}
        bordered
        columns={this.columns}
        pagination={{
          position: ["none"],
          pageSize: 10000,
        }}
        title={this.onTableTitle}
        rowKey={(record) => record.id}
      />
    );
  }

  setLoading(bLoading) {
    let action = {
      type: "setLoading",
      value: bLoading,
    };

    store.dispatch(action);
  }

  loadData(date) {
    return;
    this.setLoading(true);

    let self = this;
    axios
      .get(
        "/api/timesheet/token/" +
          Utils.getToken() +
          "/date/" +
          Utils.dateFtt("yyyy-MM-dd", this.state.date)
      )
      .then(function (res) {
        self.setLoading(false);
        if (1 === res.data.code) {
          self.props.history.push("/login");
        } else if (0 === res.data.code) {
          let newData = self.extractData(res.data.data);
          self.setState({
            dataSource: newData,
          });
        } else {
          message.error(res.data.message);
        }
      })
      .catch(function (err) {
        self.setLoading(false);
        message.error(err.message);
      });
  }

  componentDidMount() {
    window.document.title = "Expense - Money Guardian";

    this.loadData(this.state.date);

    store.dispatch({
      type: "setMenuItem",
      value: ["/main/expense"],
    });
  }

  onDateChange(date) {
    if (!date) {
      return;
    }
    date = date.toDate();
    this.setState({
      date: date,
    });
    this.loadData(date);
  }

  onTableTitle() {
    return (
      <Row>
        <Col span="18">
          <Space>
            <Popconfirm
              placement="right"
              title="Are you sure to create a new cost?"
              onConfirm={() => this.handleAdd()}
            >
              <Button
                type="primary"
                icon={<PlusSquareOutlined />}
                //onClick={this.onAddSupplier}
              >
                New Cost
              </Button>
            </Popconfirm>
          </Space>
        </Col>
        <Col span="6" style={{ textAlign: "right" }}>
          <RangePicker />
        </Col>
      </Row>
    );
  }
}

export default ContractList;
