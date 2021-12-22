import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Form, ReactInputMask, Input, Checkbox } from "antd";
import { setAuthData } from "../../store/appSlice";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { withSerpovice } from "../../hocs/withService";
import { post } from "../../apiService";
import "./Auth.css";
import { saveCredentials } from "../../actions";

const Auth = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
    toRemember: true,
    statusMsg: "",
  });

  const dispatch = useDispatch();

  const { username, email, password, toRemember, statusMsg } = state;

  const changeField = (txt, field) => setState({ ...state, [field]: txt });

  const onFinish = async (values) => {
    const res = await post("/login", {
      name: username,
      password,
    });

    let statusMsg;
    switch (res) {
      case 0: {
        statusMsg = "Wrong Password";
        break;
      }

      case false: {
        statusMsg = "User not found";
        break;
      }

      default: {
        statusMsg = "";
      }
    }

    setState({ ...state, statusMsg });
    if (!statusMsg) saveCredentials(dispatch)(res);
  };

  const toggleRemember = () => setState({ ...state, toRemember: !toRemember });

  return (
    <div className="Auth">
      <h3>Please Authenticate to continue</h3>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Username!",
            },
          ]}
        >
          <Input
            value={username}
            className="test"
            onChange={(e) => changeField(e.target.value, "username")}
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        {false && (
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your Email!",
              },
            ]}
          >
            <Input
              value={email}
              onChange={(e) => changeField(e.target.value, "email")}
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="Email"
            />
          </Form.Item>
        )}
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            value={password}
            onChange={(e) => changeField(e.target.value, "password")}
            prefix={<MailOutlined className="site-form-item-icon" />}
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox onChange={toggleRemember}>Remember me</Checkbox>
          </Form.Item>

          {false && (
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          {false && <a href="">register now!</a>}
        </Form.Item>

        <span className="statusMsg">{statusMsg}</span>
      </Form>
    </div>
  );
};

export default Auth;
