import React from "react";
import { useGetIdentity } from "@refinedev/core";
import { useModal } from "@refinedev/antd";
import {
    Row,
    Col,
    Card,
    Typography,
    Space,
    Button,
    Modal,
    Form,
    Input,
} from "antd";

const { Text } = Typography;

// retrieve metamask account information after connection
export const DashboardPage: React.FC = () => {
    const { data, isLoading } = useGetIdentity<{
        address: string;
        balance: string;
    }>();

    return (
        <Row gutter={24}>
            <Col span={12}>
                <Card
                    title="Ethereum Public ID"
                    style={{ height: "150px", borderRadius: "15px" }}
                    headStyle={{ textAlign: "center" }}
                >
                    <Space align="center" direction="horizontal">
                        <Text>{isLoading ? "loading" : data?.address}</Text>
                    </Space>
                </Card>
            </Col>
            <Col span={8}>
                <Card
                    title="Account Balance"
                    style={{ height: "150px", borderRadius: "15px" }}
                    headStyle={{ textAlign: "center" }}
                >
                    <Text>{`${
                        isLoading ? "loading" : data?.balance
                    } Ether`}</Text>
                </Card>
            </Col>
        </Row>
    );
};