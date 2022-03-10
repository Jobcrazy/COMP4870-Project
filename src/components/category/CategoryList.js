import React from "react";
import {
  Row,
  Col,
  Table,
  message,
  Button,
  Space,
  Input,
  Form,
  Modal,
  Popconfirm,
} from "antd";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";
import moment from "moment";

class Category extends React.Component {
  constructor(props) {
    super(props);

    this.bAdd = false;

    this.state = {
      dataSource: [],
      isModalVisible: false,
      amount: 0,
      date: new Date(),
      currentCategory: {
        id: 0,
        categoryName: "",
      },
    };

    this.columns = [
      {
        title: "Category",
        dataIndex: "categoryName",
        key: "categoryName",
      },
      {
        title: "Action",
        key: "operation",
        fixed: "right",
        width: "150px",
        render: (text, record) => (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                this.bAdd = false;
                this.onAddGoal();
                this.setState({
                  currentCategory: {
                    id: record.id,
                    categoryName: record.categoryName,
                  },
                });
              }}
            />
            <Popconfirm
              placement="left"
              title="Are you sure to delete this category?"
              onConfirm={() => this.handleDelete(record.id)}
            >
              <Button danger size="small" icon={<DeleteOutlined />} />
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
    this.resetForm = this.resetForm.bind(this);
  }

  async loadData() {
    this.setLoading(true);

    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "api/Category",
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
      message.error("Something went error.");
    }
  }

  componentDidMount() {
    window.document.title = "Categpry - Money Guardian";

    let action = {
      type: "setMenuItem",
      value: ["/main/category"],
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

    try {
      let result = await axios({
        method: "DELETE",
        url: Utils.getDomain() + "api/Category/" + id,
        params: {
          token: Utils.getToken(),
          id,
        },
        data: {},
      });

      this.handleCancelAdd();
      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.loadData();
    } catch (err) {
      this.handleCancelAdd();
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  handleCancelAdd() {
    this.resetForm();
    this.setState({
      isModalVisible: false,
    });
  }

  onAddGoal() {
    this.setState({
      isModalVisible: true,
    });
  }

  resetForm() {
    this.setState({
      currentCategory: {
        id: 0,
        categoryName: "",
      },
    });
  }

  async handleAdd(values) {
    this.setLoading(true);

    let url = this.bAdd
      ? "api/Category"
      : "api/Category/" + this.state.currentCategory.id;
    let method = this.bAdd ? "POST" : "PUT";

    try {
      let result = await axios({
        method,
        url,
        params: {
          token: Utils.getToken(),
        },
        data: {
          id: this.state.currentCategory.id,
          categoryName: values.categoryName
        },
      });

      this.handleCancelAdd();
      this.setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      this.loadData();
      this.setState({
        currentCategory: {
          id: 0,
          categoryName: "",
        },
      });
    } catch (err) {
      this.handleCancelAdd();
      this.setLoading(false);
      console.log(err);
      message.error("Something went error.");
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
              onClick={() => {
                this.bAdd = true;
                this.setState({
                  amount: 0,
                  date: new Date(),
                });
                this.onAddGoal();
              }}
            >
              New Category
            </Button>
          </Space>
        </Col>
        <Modal
          title="Add Category"
          visible={this.state.isModalVisible}
          onOk={() => this.formRef.current.submit()}
          onCancel={this.handleCancelAdd}
          destroyOnClose={true}
        >
          <Form
            name="control-ref"
            initialValues={{
              categoryName: this.state.currentCategory.categoryName,
            }}
            onFinish={this.handleAdd}
            ref={this.formRef}
            preserve={false}
          >
            <Form.Item
              colon={false}
              label="Name"
              name="categoryName"
              rules={[
                {
                  required: true,
                  message: "Please Input the Category Name",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Please Input the Category Name"
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

export default Category;
