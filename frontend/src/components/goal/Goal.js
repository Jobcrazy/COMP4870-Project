import React from "react";
import {
  Row,
  Col,
  Table,
  message,
  Button,
  Space,
  DatePicker,
  InputNumber,
  Form,
  Modal,
  Popconfirm,
} from "antd";
import { PlusSquareOutlined } from "@ant-design/icons";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import moment from "moment";

class Goal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      date: new Date(),
      isModalVisible: false,
      amount: 0,
      date: new Date(),
    };

    this.columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
        render: (text, record) => {
          return Utils.dateFtt("yyyy-MM", Utils.cSharpDateToJsData(text));
        },
      },
      {
        title: "Goal",
        dataIndex: "amount",
        key: "amount",
      },
      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: "150px",
        render: (text, record) => (
          <Space>
            <Popconfirm
              placement="left"
              title="Are you sure to delete this budget?"
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

    this.formRef = React.createRef();

    this.onTableTitle = this.onTableTitle.bind(this);
    this.loadData = this.loadData.bind(this);
    this.handleCancelAdd = this.handleCancelAdd.bind(this);
    this.onAddGoal = this.onAddGoal.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  async loadData() {
    this.setLoading(true);

    try {
      let result = await axios({
        method: "POST",
        url: "api/Goal/all",
        params: {
          token: Utils.getToken(),
        },
      });

      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.setState({
        dataSource: result.data.data,
      });
    } catch (err) {
      this.setLoading(false);
      console.log(err);
      message.error("发生错误");
    }
  }

  componentDidMount() {
    window.document.title = "Budget - Money Guardian";

    let action = {
      type: "setMenuItem",
      value: ["/main/goal"],
    };
    store.dispatch(action);

    this.loadData();
  }

  setLoading(bLoading) {
    let action = {
      type: "setLoading",
      value: bLoading,
    };

    store.dispatch(action);
  }

  async handleDelete(id) {
    this.setLoading(true);
    this.handleCancelAdd();

    try {
      let result = await axios({
        method: "POST",
        url: "api/Goal/del",
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
      message.error("发生错误");
    }
  }

  handleCancelAdd() {
    this.setState({
      isModalVisible: false,
    });
  }

  onAddGoal() {
    this.setState({
      isModalVisible: true,
    });
  }

  async handleAdd() {
    let values = this.formRef.current.getFieldsValue(["amount", "date"]);
    values.date = values.date.format("YYYY-MM");

    this.setLoading(true);
    this.handleCancelAdd();

    try {
      let result = await axios({
        method: "POST",
        url: "api/Goal/add",
        params: {
          token: Utils.getToken(),
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
      message.error("发生错误");
    }
  }

  onTableTitle() {
    return (
      <Row>
        <Col span="18">
          <Space>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              onClick={this.onAddGoal}
            >
              New Budget
            </Button>
          </Space>
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
}

export default Goal;
