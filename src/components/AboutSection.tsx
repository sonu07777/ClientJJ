import { BankOutlined, TeamOutlined, AimOutlined, TrophyOutlined } from '@ant-design/icons';
import { Card, Typography, Row, Col } from 'antd';
import { SideBarMainLayout } from '../Layout/SideBarMainLayout';

const { Title, Paragraph, Text } = Typography;

export function AboutSection() {
  const stats = [
    { label: 'Years in Business', value: '10+', icon: TrophyOutlined },
    { label: 'Team Members', value: '50+', icon: TeamOutlined },
    { label: 'Projects Completed', value: '200+', icon: AimOutlined },
    { label: 'Office Locations', value: '5', icon: BankOutlined }
  ];

  return (
    // <div className="space-y-8">
    <SideBarMainLayout>
      {/* Header */}
      <div>
        <Title level={2} style={{ marginBottom: '8px' }}>About Us</Title>
        <Text type="secondary" className="text-base">Learn more about our company and mission</Text>
      </div>

      {/* Company Overview */}
      <Card bordered={false} className="shadow-sm">
        <Title level={3} style={{ marginBottom: '16px' }}>Our Company</Title>
        <div className="space-y-4">
          <Paragraph className="text-base">
            Welcome to our Customer Management System. We are a leading provider of business solutions,
            dedicated to helping companies manage their customer relationships effectively and efficiently.
          </Paragraph>
          <Paragraph className="text-base">
            Our platform is designed to streamline your workflow, improve customer satisfaction, and
            drive business growth. With cutting-edge technology and user-friendly interfaces, we make
            customer management simple and effective.
          </Paragraph>
          <Paragraph className="text-base">
            Founded in 2016, we have been serving businesses across various industries, from startups
            to large enterprises. Our commitment to excellence and innovation has made us a trusted
            partner for organizations worldwide.
          </Paragraph>
        </div>
      </Card>

      {/* Stats */}
      <Row gutter={[24, 24]}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered={false} className="shadow-sm text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <stat.icon className="text-2xl text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mission & Vision */}
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm p-8 text-white h-full">
            <h3 className="text-xl font-bold mb-4">Our Mission</h3>
            <p className="text-blue-50 text-base">
              To empower businesses with innovative tools and solutions that transform how they
              interact with customers, driving sustainable growth and success.
            </p>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm p-8 text-white h-full">
            <h3 className="text-xl font-bold mb-4">Our Vision</h3>
            <p className="text-purple-50 text-base">
              To be the global leader in customer management solutions, recognized for our
              commitment to innovation, quality, and customer success.
            </p>
          </div>
        </Col>
      </Row>

      {/* Core Values */}
      <Card bordered={false} className="shadow-sm">
        <Title level={3} style={{ marginBottom: '24px' }}>Core Values</Title>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Title level={4}>Innovation</Title>
            <Paragraph className="text-base text-gray-600">
              We constantly push boundaries and embrace new technologies to deliver cutting-edge solutions.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Integrity</Title>
            <Paragraph className="text-base text-gray-600">
              We operate with honesty and transparency, building trust with our customers and partners.
            </Paragraph>
          </Col>
          <Col xs={24} md={8}>
            <Title level={4}>Excellence</Title>
            <Paragraph className="text-base text-gray-600">
              We strive for excellence in everything we do, delivering quality that exceeds expectations.
            </Paragraph>
          </Col>
        </Row>
      </Card>
      </SideBarMainLayout>
    // </div> 
  );
}
