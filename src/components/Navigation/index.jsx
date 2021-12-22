import React, { useState } from "react";
import { Menu, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../store/appSlice";
import { signOut } from "../../actions";
import { Link } from "react-router-dom";

import "./navigation.scss";

import {
  AppstoreOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
  LogoutOutlined,
  TableOutlined,
} from "@ant-design/icons";

const Navigation = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    collapsed: false,
  });

  const { collapsed } = state;

  const toggleCollapsed = () => {
    setState({
      ...state,
      collapsed: !state.collapsed,
    });
  };

  return (
    <div className="Navigation">
      <div className="navWrapper" style={{ width: 256, height: "100vh" }}>
        <Button
          type="primary"
          className={`collapseBtn ${collapsed ? "collpsedBtn" : ""}`}
          onClick={toggleCollapsed}
        >
          {collapsed ? ">" : "<"}
        </Button>

        <Menu
          defaultSelectedKeys={["transactions"]}
          //defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
        >
          <Menu.Item key="notifications" icon={<ContainerOutlined />}>
            <Link to="/notifications">Notifications</Link>
          </Menu.Item>
          <Menu.Item key="transactions" icon={<TableOutlined />}>
            <Link to="/transactions">Transactions</Link>
          </Menu.Item>
          <Menu.Item key="contacts" icon={<DesktopOutlined />}>
            <Link to="/contacts">User Contacts</Link>
          </Menu.Item>
          <Menu.Item
            key="logout"
            icon={<LogoutOutlined />}
            onClick={() => signOut(dispatch)}
          >
            <Link to="/">Logout</Link>
          </Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default Navigation;
