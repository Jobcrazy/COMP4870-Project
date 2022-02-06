import React, { useContext, useState, useEffect, useRef } from "react";
import {
    Row,
    Col,
    Table,
    Input,
    Form,
    message,
    Button,
    Space,
    Modal,
    Popconfirm,
} from "antd";
import axios from "axios";
import { PlusSquareOutlined } from "@ant-design/icons";
import "./List.css";
import store from "../../store";
import moment from "moment";
import Utils from "../../common/Utils";

const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave(record, values);
        } catch (errInfo) {}
    };

    let childNode = children;

    if (editable && editable(record)) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `Required`,
                    },
                ]}
            >
                <Input.Password ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap editable"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
        return <td {...restProps}>{childNode}</td>;
    }

    return <td {...restProps}>{childNode}</td>;
};

class UserList extends React.Component {
    constructor(props) {
        super(props);

        this.handleSave = this.handleSave.bind(this);
        this.onTableTitle = this.onTableTitle.bind(this);
        this.onDateChange = this.onDateChange.bind(this);
        this.onShowAddUser = this.onShowAddUser.bind(this);
        this.onHideAddUser = this.onHideAddUser.bind(this);
        this.onFinish = this.onFinish.bind(this);

        this.columns = [
            {
                title: "Username",
                dataIndex: "username",
                key: "username",
                width: 150,
            },
            {
                title: "Password",
                dataIndex: "password",
                key: "password",
                editable: () => true,
                render: ()=>{
                    return "********";
                }
            },
            {
                title: "Action",
                key: "operation",
                fixed: "right",
                width: "8.3333%",
                render: (text, record) => (
                    <Space>
                        <Popconfirm
                            placement="left"
                            title="Are you sure to delete this user?"
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
            bShowAddUser: false,
        };
    }

    handleDelete = (id) => {
        this.setLoading(true);

        let self = this;
        axios
            .delete("/api/user/token/" + Utils.getToken() + "/id/" + id)
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

    handleSave = (record, values) => {
        let keys = Object.keys(values);
        for (let index in keys) {
            let key = keys[index];
            record[key] = values[key];
        }

        this.setLoading(true);

        let dataSource = this.state.dataSource;

        for (let n = 0; n < dataSource.length; ++n) {
            if (record.id == dataSource[n].id) {
                dataSource[n] = record;
                break;
            }
        }

        let self = this;
        axios
            .post("/api/user/update/token/" + Utils.getToken(), record)
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
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

    onShowAddUser() {
        this.setState({
            bShowAddUser: true,
        });
    }

    onHideAddUser() {
        this.setState({
            bShowAddUser: false,
        });
    }

    render() {
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });

        return (
            <Table
                components={components}
                expandable={{
                    expandIconColumnIndex: 1,
                    defaultExpandAllRows: true,
                }}
                rowClassName={() => "editable-row"}
                dataSource={this.state.dataSource}
                bordered
                columns={columns}
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

    loadData() {
        this.setLoading(true);

        let self = this;
        axios
            .get("/api/user/all/token/" + Utils.getToken())
            .then(function (res) {
                self.setLoading(false);
                if (1 === res.data.code) {
                    self.props.history.push("/login");
                } else if (0 === res.data.code) {
                    self.setState({
                        dataSource: res.data.data,
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
        window.document.title = "User Management";

        this.loadData();

        store.dispatch({
            type: "setMenuItem",
            value: ["/main/user"],
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
        this.loadData();
    }

    onFinish(values) {
        this.setLoading(true);

        let self = this;
        axios
            .post("/api/user/token/" + Utils.getToken(), values)
            .then(function (res) {
                if (0 === res.data.code) {
                    console.log(res.data.data.token);
                    self.loadData();
                } else {
                    message.error(res.data.message);
                }
                self.setLoading(false);
                self.setState({ bShowAddUser: false });
            })
            .catch(function (err) {
                message.error(err.message);
                self.setLoading(false);
            });
    }

    onTableTitle() {
        return (
            <Row>
                <Col span="18">
                    <Button
                        type="primary"
                        icon={<PlusSquareOutlined />}
                        onClick={this.onShowAddUser}
                    >
                        New User
                    </Button>
                </Col>
                <Modal
                    title="Add a User"
                    visible={this.state.bShowAddUser}
                    //onOk={handleOk}
                    onCancel={this.onHideAddUser}
                    footer={null}
                >
                    <Col span={24}>
                        <Form name="basic" onFinish={this.onFinish}>
                            <Form.Item
                                name="userName"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input the username",
                                    },
                                ]}
                            >
                                <Input placeholder="Username" size="large" />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input the password",
                                    },
                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>
                                    Save
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Modal>
            </Row>
        );
    }
}

export default UserList;
