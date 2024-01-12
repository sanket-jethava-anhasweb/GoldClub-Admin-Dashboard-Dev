import React, { useEffect, useState } from "react";
import { Card, Divider, List, Skeleton, message, Space, Badge, Avatar, Button, Col, Row, Statistic,ConfigProvider,theme } from "antd";
import { UserOutlined, EditOutlined, EllipsisOutlined, SettingOutlined, EyeOutlined, DownloadOutlined } from '@ant-design/icons';

import SectionTitle from "../../components/Title/SectionTitle";

import { useLazyQuery } from "@apollo/client";
import { GET_HOME, SEARCH_CUSTOMERS, GET_STORE_DETAILS } from "../../GraphQl/Query";
import LoadMore from "../../components/Buttons/LoadMore";
import { useDispatch, useSelector } from "react-redux";
import { setSearchState } from "../../redux/actions/client";
import DashboardTitle from "../../components/Title/DashboardTitle";
import DisplayPrice from "../../components/Utils/DisplayPrice";
import { Link, useNavigate } from "react-router-dom";
const { Meta } = Card;

const Dashboard = () => {
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [messageApi, contextHolder] = message.useMessage();
  const search = useSelector((state) => state?.client?.search);
  const activities = useSelector((state) => state?.client?.activities);

  const [localSearch, setLocalSearch] = useState(search?.edges);
  const [localActivites, setLocalActivities] = useState([]);

  const [after, setAfter] = useState({ searchAfter: null });
  const [loading, setLoading] = useState(true);
  const onChange = function (checked) {
    setLoading(!checked);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const setTrial = (message) => {
    messageApi.open({
      type: "loading",
      content: message,
    });
  };
  const setSuccess = (message) => {
    messageApi.open({
      type: "success",
      content: message,
    });
  };
  const setError = (message) => {
    messageApi.open({
      type: "error",
      content: message,
    });
  };
  // DONE
  const [fetchDetails, details] = useLazyQuery(SEARCH_CUSTOMERS, {
    variables: {
      after: null,
      first: 5,
      query: "",
    },
    onCompleted: (data) => {
      dispatch(setSearchState(data?.search));
      setLocalSearch(data?.search?.edges);
    },
    onError: (err) => {
      setError(
        <>
          Failed to retrieve customers{" "}
          <span
            onClick={fetchDetails}
            className='text-blue-700 underline cursor-pointer'
          >
            Retry
          </span>
        </>
      );
      console.log(err);
    },
  });
  //

  const [fetchActivities, activity] = useLazyQuery(GET_HOME, {
    onCompleted: (data) => {
      console.log(data);
      dispatch(setLocalActivities(data));
    },
    onError: (err) => {
      setError(
        <>
          Failed to retrieve activities{" "}
          <span
            onClick={fetchDetails}
            className='text-blue-700 underline cursor-pointer'
          >
            Retry
          </span>
        </>
      );
      console.log(err);
    },
  });
  useEffect(() => {
    fetchDetails();
    fetchActivities();
  }, []);

  const [getStoreDetails, storeDetails] = useLazyQuery(GET_STORE_DETAILS, {
    onCompleted: (data) => {
      console.log(data);
      window.open(data.exportStoreDetails, '_blank');
    }
  })
  // const handleSearch = (e) => {
  //   let val = e.target.value.toLowerCase();
  //   console.log(val);
  //   if (val !== "")
  //     setLocalSearch(
  //       search?.edges?.filter(
  //         (item) =>
  //           item?.node?.firstName?.toLowerCase().includes(val) ||
  //           item?.node?.lastName?.toLowerCase().includes(val) ||
  //           item?.node?.phoneNumber?.toLowerCase().includes(val)
  //       )
  //     );
  //   else if (val == " " || val == null) setLocalSearch(search?.edges);
  // };

  return (
    <ConfigProvider theme={{
      algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
    }}>
    <section className='py-4 w-full'>
      {contextHolder}
      <SectionTitle title='Dashboard' />
      <Divider className='dark:bg-white/10' />
      <section className="py-4 flex flex-row w-full justify-between h-full">
        <div className="flex flex-col w-full justify-evenly items-center">
          <div className="w-full flex justify-evenly">
            <Statistic title="Total Users" value={activity?.data?.totalUsers?.totalCount} />
            <Statistic title="Active Stores" value={activity?.data?.totalActiveStore} precision={2} />
          </div>
          <div className="mt-10">
            <button className="bg-blue-600 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => (getStoreDetails())}>
              <svg className="fill-current w-4 h-4 md:mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
              </svg>
              <span className="pl-2">Download Store Details</span>
            </button>
            </div>
        </div>
      </section>

      <DashboardTitle title='Activities' />
      <section className='flex items-start justify-start flex-wrap gap-3'>
        <Card
          type='inner'
          size='default'
          className='dark:bg-slate-900 shadow-sm cursor-pointer text:white hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
        >
          <h4 className='font-semibold '>Sales Today</h4>
          <Skeleton
            active
            loading={activity?.loading}
            paragraph={{
              rows: 1,
            }}
            title={null}
          >
            <h2 className='text-2xl font-semibold'>
              <DisplayPrice price={localActivites?.salesToday?.gross?.amount} />
            </h2>
          </Skeleton>
        </Card>
        <Card
          type='inner'
          size='default'
          className='dark:bg-slate-900 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
        >
          <h4 className='font-semibold '>Orders To Capture</h4>
          <Skeleton
            active
            loading={activity?.loading}
            paragraph={{
              rows: 1,
            }}
            title={null}
          >
            <h2 className='text-2xl font-semibold'>
              {localActivites?.ordersToCapture?.totalCount}
            </h2>
          </Skeleton>
        </Card>
        <Card
          type='inner'
          size='default'
          className='dark:bg-slate-900 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
        >
          <h4 className='font-semibold '>Out of Stock</h4>
          <Skeleton
            active
            loading={activity?.loading}
            paragraph={{
              rows: 1,
            }}
            title={null}
          >
            <h2 className='text-2xl font-semibold'>
              {localActivites?.productsOutOfStock?.totalCount}
            </h2>
          </Skeleton>
        </Card>
        <Card
          type='inner'
          size='default'
          className='dark:bg-slate-900 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
        >
          <h4 className='font-semibold '>Orders Today</h4>
          <Skeleton
            active
            loading={activity?.loading}
            paragraph={{
              rows: 1,
            }}
            title={null}
          >
            <h2 className='text-2xl font-semibold'>
              {localActivites?.ordersToday?.totalCount}
            </h2>
          </Skeleton>
        </Card>
      </section>
      <DashboardTitle title='Recent orders' />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        dataSource={localActivites?.activities?.edges}
        renderItem={(item) => (
          <List.Item>
            
              <Badge.Ribbon
                text={item?.node?.orderStatus?.toUpperCase()}
                color={item?.node?.orderStatus === "unfulfilled" ? undefined : item?.node?.orderStatus === "cancelled" || "canceled" ? "red" : "green"}>
              <Card key={item?.id} title={item?.node?.orderNumber} size="large">
                <div className="flex justify-between pr-2">
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-semibold text-gray-600 flex text-xs'>
                      <span className='uppercase'>Amount:</span>
                    </h3>
                    <span className='font-semibold text-white text-xl flex items-center gap-x-1'>
                      {(item?.node?.amount && (
                        <DisplayPrice price={Math.floor(item?.node?.amount)+".00"} />
                      )) ||
                        "N/A"}
                    </span>
                  </div>

                  <div className='flex items-center justify-between w-half'>
                    <div className='flex flex-col my-2 w-1/2'>
                      <h3 className='font-semibold text-gray-600 flex text-xs'>
                        {/* <MdOutlineAddLocationAlt /> */}
                        <span className='uppercase'>QTY:</span>
                      </h3>
                      <span className='font-bold text-white text-xl'>
                        {item?.node?.quantity || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col my-4 w-full'>
                    <h3 className='font-semibold text-gray-600 flex items-center text-xs'>
                      <span className='uppercase'>Payment status:</span>
                    </h3>
                    <span className='font-bold'>
                    <Space>
                      <Badge color={item?.node?.paymentStatus === "not-charged" ? "orange" : item?.node?.paymentStatus === "pending" ? "red" : "green"} className='pr-2'/>
                    </Space>
                      {item?.node?.paymentStatus?.toUpperCase() || "N/A"}
                    </span>
                </div>
                <div className='flex items-center flex-start w-full'>
                  <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                  <div className="pl-2">
                    <h3 className='font-bold flex text-md'>
                      {item?.node?.user?.firstName + " " + item?.node?.user?.lastName || "N/A"}
                    </h3>
                    <span className='font-semibold text-gray-600 text-md'>
                      {item?.node?.user?.phoneNumber || "N/A"}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <div className='flex flex-col my-2 w-1/2'>
                    <span className='font-thin text-grey-600 text-xs'>
                        {item?.node?.date?.split("T")[0] || "N/A"}
                      </span>
                  </div>
                </div>
                
              </Card>
            </Badge.Ribbon>
          </List.Item>
        )}
      />
      {localActivites?.activities?.edges.length > 0 && (
        <Link to='/dashboard/b2b/orders'>
          <LoadMore loading={details?.loading} handleRefetch={() => {}} />
        </Link>
      )}
      <Divider className='dark:bg-white/10' />
      <DashboardTitle title='Retailers' />
      {/* <SearchComponent handleSearch={handleSearch} /> */}
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 4,
          lg: 5,
          xl: 6,
        }}
        loading={details?.loading}
        dataSource={localSearch}
        renderItem={(item) => (
          <List.Item>
            <Card
              type='inner'
              size='default'
              className='dark:bg-slate-900 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm  md:h-auto flex flex-col items-start justify-start rounded-md border-1 border-black/20 dark:border-white'
            >
              <a
                href={"https://wa.me/" + item?.node?.phoneNumber}
                target='_blank'
                rel='noopener noreferrer'
              >
                <h4 className='font-semibold '>
                  {item?.node?.firstName}{" "}
                  {item?.node?.lastName || "Unavailable"}
                </h4>
                <h5>{item?.node?.phoneNumber}</h5>
              </a>
            </Card>
          </List.Item>
        )}
      />

      
      {search?.pageInfo?.hasNextPage && (
        <LoadMore
          loading={details?.loading}
          handleRefetch={() => {
            setAfter({ ...after, searchAfter: search?.pageInfo?.endCursor });

            details?.fetchMore({
              variables: { after: search?.pageInfo?.endCursor },
              updateQuery: (prevResult, { fetchMoreResult }) => {
                fetchMoreResult.search.edges = [
                  ...localSearch,
                  ...fetchMoreResult.search.edges,
                ];
                return fetchMoreResult;
              },
            });
          }}
        />
      )}


      <Divider className='dark:bg-white/10' />
      <DashboardTitle title='Top Products' />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 4,
          xl: 4,
        }}
        dataSource={localActivites?.productTopToday?.edges}
        renderItem={(item) => (
          <List.Item>
            <Card
              style={{
                width: 300,
              }}
              cover={
                <img
                  alt="example"
                  src={item?.node?.product?.thumbnail?.url}
                />
              }
              actions={[
                <Meta
                title={item?.node?.quantityOrdered}/>,
                <DisplayPrice className='font-bold text-black text-l' price={item?.node?.revenue?.gross?.amount} />,
                <EyeOutlined key="ellipsis" />,
              ]}
            >
              <Meta
                title={item?.node?.product?.name}
                description={item?.node?.product?.category?.name}
              />
            </Card>
          </List.Item>
        )}
      />
      <Divider className='dark:bg-white/10' />
    </section>
    </ConfigProvider>
  );
};

export default Dashboard;
