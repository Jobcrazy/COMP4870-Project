import React, { useEffect, useState } from "react";
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

const CategoryList = props => {
  const [dataSource, setDataSource] = useState();
  const [isCreateForm, setIsCreateForm] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    window.document.title = "Category - Money Guardian";
    let action = {
      type: "setMenuItem",
      value: ["/main/category"],
    };
    store.dispatch(action);
    loadData();
  }, []);

  const setLoading = (bLoading) => {
    let action = {
      type: "setLoading",
      value: bLoading,
    };

    store.dispatch(action);
  }

  const loadData = async () => {
    setLoading(true);
    try {
      let result = await axios({
        method: "GET",
        url: Utils.getDomain() + "api/Category",
        params: {
          token: Utils.getToken(),
        },
      });

      setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }

      setDataSource(result.data.data);
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  const onAddCategory = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentCategory(null);
  }

  const handleAddCategory = async (values) => {
    setLoading(true);
    closeModal();

    let url = isCreateForm ? "api/Category" : "api/Category/" + currentCategory.id;
    let method = isCreateForm ? "POST" : "PUT"
    if (!isCreateForm) {
      values = {
        categoryName: values.categoryName,
        id: currentCategory.id
      };
    }

    try {
      let result = await axios({
        method: method,
        url: Utils.getDomain() + url,
        params: {
          token: Utils.getToken(),
        },
        data: values,
      });

      setLoading(false);

      if (result.data.code != 0) {
        message.error(result.data.message);
        return;
      }
      setCurrentCategory(null);
      loadData();
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  const handleDelete = async (id) => {
    setLoading(true);

    try {
      let result = await axios({
        method: "DELETE",
        url: Utils.getDomain() + "api/Category/" + id,
        params: {
          token: Utils.getToken(),
        },
        data: {},
      });

      setLoading(false);

      if (result.data.code !== 0) {
        message.error(result.data.message);
        return;
      }

      loadData();
    } catch (err) {
      setLoading(false);
      console.log(err);
      message.error("Something went error.");
    }
  }

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
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
              setCurrentCategory(record);
              setIsCreateForm(false);
              onAddCategory();
            }}
          />
          <Popconfirm
            placement="left"
            title="Are you sure to delete this category?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onTableTitle = () => {
    return(
      <Row>
        <Col span="18">
          <Space>
            <Button
              type="primary"
              icon={<PlusSquareOutlined />}
              onClick={() => {
                setCurrentCategory(null);
                setIsCreateForm(true);
                onAddCategory();
              }}
            >
              New Category
            </Button>
          </Space>
        </Col>
        <Modal
          title="Add Category"
          visible={isModalVisible}
          onOk={() => {form.validateFields().then((values) => {
            form.resetFields();
            handleAddCategory(values);
          })}}
          onCancel={closeModal}
          destroyOnClose={true}
        >
          <Form
            name="control-ref"
            onFinish={handleAddCategory}
            form={form}
            preserve={false}
            initialValues={{
              categoryName: currentCategory?.categoryName,
            }}
          >
            <Form.Item
              colon={false}
              label="Category Name"
              name="categoryName"
              rules={[
                {
                  required: true,
                  message: "Please Input Your Category",
                },
              ]}
            >
              <Input
                style={{ width: "100%" }}
                placeholder="Please Input Your Category"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Row>
    );
  };


  return(
    <>
      <Table
        dataSource={dataSource}
        bordered
        columns={columns}
        pagination={{
          position: ["none"],
          pageSize: 10000,
        }}
        title={onTableTitle}
        rowKey={(record) => record.id}
      />
    </>
  );
}

export default CategoryList;
