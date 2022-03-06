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
  InputNumber,
  Form,
  Modal,
} from "antd";
import axios from "axios";
import { PlusSquareOutlined } from "@ant-design/icons";
import store from "../../store";
import moment from "moment";
import Utils from "../../common/Utils";

const { RangePicker } = DatePicker;

class ContractList extends React.Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Cost",
        dataIndex: "amount",
        key: "amount",
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
      isModalVisible: false,
    };

    this.onTableTitle = this.onTableTitle.bind(this);
    this.onAddExpense = this.onAddExpense.bind(this);
    this.handleCancelAdd = this.handleCancelAdd.bind(this);
  }

  onAddExpense() {
    this.setState({
      isModalVisible: true,
    });
  }

  handleDelete = (id) => {
    this.setLoading(true);

    let self = this;
    axios
      .delete(Utils.getDomain() + "/api/timesheet/token/" + Utils.getToken() + "/id/" + id)
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
        Utils.getDomain() + "/api/timesheet/token/" +
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

  handleCancelAdd() {
    this.setState({
      isModalVisible: false,
    });
  }

  onTableTitle() {
    return (
      <Row>
        <Col span="18">
          <Space>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              onClick={this.onAddExpense}
            >
              New Cost
            </Button>
          </Space>
        </Col>
        <Col span="6" style={{ textAlign: "right" }}>
          <RangePicker />
        </Col>

        <Modal
          title="Add Budget"
          visible={this.state.isModalVisible}
          onOk={this.handleAdd}
          onCancel={this.handleCancelAdd}
          destroyOnClose={true}
        >
          <Form
            name="control-ref"
            initialValues={{
              //remember: true,
              amount: this.state.amount,
              date: moment(this.state.date, "YYYY-MM"),
            }}
            //onFinish={this.onFinish}
            ref={this.formRef}
            preserve={false}
          >
            <Form.Item
              colon={false}
              label="Budget"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please Input Your Budget",
                },
              ]}
            >
              <InputNumber
                prefix="$"
                style={{ width: "100%" }}
                placeholder="Please Input Your Budget"
              />
            </Form.Item>
            <Form.Item
              colon={false}
              label="Month"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Please Slect a Month",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                picker="month"
                format={"YYYY-MM"}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    );
  }
}

export default ContractList;
