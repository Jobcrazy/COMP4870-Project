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
  Select,
  Input,
} from "antd";
import axios from "axios";
import { PlusSquareOutlined } from "@ant-design/icons";
import store from "../../store";
import moment from "moment";
import Utils from "../../common/Utils";

const { RangePicker } = DatePicker;
const { Option } = Select;

class ContractList extends React.Component {
  constructor(props) {
    super(props);

    this.bAdd = false;
    this.costId = null;

    this.columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (text, record) => {
          return Utils.dateFtt("yyyy-MM-dd", Utils.cSharpDateToJsData(text));
        },
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
        render: (text, record) => {
          return record.category.categoryName;
        },
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
            <Button
              size="small"
              onClick={() => {
                this.bAdd = false;
                this.costId = record.id;
                this.onAddExpense();
                this.setState({
                  amount: record.amount,
                  date: new Date(record.date),
                  category: record.category.id,
                  note: record.note,
                });
              }}
            >
              Edit
            </Button>
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
      categories: [],
      category: null,
    };

    this.formRef = React.createRef();
    this.onTableTitle = this.onTableTitle.bind(this);
    this.onAddExpense = this.onAddExpense.bind(this);
    this.handleCancelAdd = this.handleCancelAdd.bind(this);
    this.loadCategory = this.loadCategory.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  onAddExpense() {
    this.setState({
      isModalVisible: true,
    });
  }

  async handleDelete(id) {
    this.setLoading(true);
    this.handleCancelAdd();

    try {
      let result = await axios({
        method: "DELETE",
        url: Utils.getDomain() + "api/Expense/del",
        params: {
          token: Utils.getToken(),
          id,
        },
        data: {},
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.loadData();
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

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

  async handleAdd(values) {
    values.date = values.date.format("YYYY-MM-DD");
    values.cid = values.category;
    delete values.category;

    this.setLoading(true);
    this.handleCancelAdd();

    let url =
      Utils.getDomain() +
      (this.bAdd ? "api/Expense/add" : "api/Expense/update");
    let method = this.bAdd ? "POST" : "PUT";

    try {
      let result = await axios({
        method,
        url,
        params: {
          token: Utils.getToken(),
          id: this.costId,
        },
        data: values,
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.loadData();
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

  async loadCategory() {
    let self = this;
    self.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "/api/Category",
        params: {
          token: Utils.getToken(),
        },
      });

      self.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.setState({
        categories: result.data.data,
      });
    } catch (err) {
      self.setLoading(false);
      message.error(err.message);
    }
  }

  async loadData(date) {
    let self = this;
    self.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "/api/Expense/list",
        params: {
          token: Utils.getToken(),
        },
      });

      self.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.setState({
        dataSource: result.data.data,
      });
    } catch (err) {
      self.setLoading(false);
      message.error(err.message);
    }
  }

  async componentDidMount() {
    window.document.title = "Expense - Money Guardian";

    await this.loadCategory();
    await this.loadData(this.state.date);

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
              onClick={() => {
                this.bAdd = true;
                this.costId = null;
                this.onAddExpense();
                this.setState({
                  amount: 0,
                  date: new Date(),
                  category: null,
                  note: "",
                });
              }}
            >
              New Cost
            </Button>
          </Space>
        </Col>
        <Col span="6" style={{ textAlign: "right" }}>
          {/*<RangePicker />*/}
        </Col>

        <Modal
          title="Add Expense"
          visible={this.state.isModalVisible}
          onOk={() => this.formRef.current.submit()}
          onCancel={this.handleCancelAdd}
          destroyOnClose={true}
        >
          <Form
            name="control-ref"
            initialValues={{
              amount: this.state.amount,
              date: moment(this.state.date, "YYYY-MM-dd"),
              note: this.state.note,
              category: this.state.category,
            }}
            onFinish={this.handleAdd}
            ref={this.formRef}
            preserve={false}
            labelCol={{ span: 4 }}
          >
            <Form.Item
              colon={false}
              label="Date"
              name="date"
              rules={[
                {
                  required: true,
                  message: "Please Select a Month",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                picker="date"
                format={"YYYY-MM-DD"}
              />
            </Form.Item>
            <Form.Item
              colon={false}
              label="Amount"
              name="amount"
              rules={[
                {
                  required: true,
                  message: "Please Input Your Cost",
                },
              ]}
            >
              <InputNumber
                prefix="$"
                style={{ width: "100%" }}
                placeholder="Please Input Your Cost"
              />
            </Form.Item>
            <Form.Item
              colon={false}
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: "Please Select a Category",
                },
              ]}
            >
              <Select
                placeholder="Select a Category"
                optionFilterProp="children"
              >
                {this.state.categories.map((category) => (
                  <Option value={category.id}>{category.categoryName}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              colon={false}
              label="Note"
              name="note"
              rules={[
                {
                  required: true,
                  message: "Please Input Your Note",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Please Input Your Note"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    );
  }
}

export default ContractList;
