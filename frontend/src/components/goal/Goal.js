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
import { PlusSquareOutlined } from "@ant-design/icons";
import axios from "axios";
import Utils from "../../common/Utils";
import "../../store";
import store from "../../store";

class Goal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataSource: [],
      date: new Date(),
    };

    this.columns = [
      {
        title: "Date",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "Goal",
        dataIndex: "cost",
        key: "cost",
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

    this.onTableTitle = this.onTableTitle.bind(this);
  }

  componentDidMount() {
    window.document.title = "Goal - Money Guardian";

    let action = {
      type: "setMenuItem",
      value: ["/main/goal"],
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

  onTableTitle() {
    return (
      <Row>
        <Col span="18">
          <Space>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              //onClick={this.onAddSupplier}
            >
              New Goal
            </Button>
          </Space>
        </Col>
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
