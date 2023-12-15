import React, { useEffect, useState } from "react";
import { Card, Divider, List, Skeleton, message } from "antd";

import SectionTitle from "../../components/Title/SectionTitle";

import { useLazyQuery } from "@apollo/client";
import { GET_HOME, SEARCH_CUSTOMERS } from "../../GraphQl/Query";
import LoadMore from "../../components/Buttons/LoadMore";
import { useDispatch, useSelector } from "react-redux";
import { setSearchState } from "../../redux/actions/client";
import DashboardTitle from "../../components/Title/DashboardTitle";
import DisplayPrice from "../../components/Utils/DisplayPrice";
import { Link, useNavigate } from "react-router-dom";
const Dashboard = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const search = useSelector((state) => state?.client?.search);
  const activities = useSelector((state) => state?.client?.activities);

  const [localSearch, setLocalSearch] = useState(search?.edges);
  const [localActivites, setLocalActivities] = useState([]);

  const [after, setAfter] = useState({ searchAfter: null });
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
    <section className='py-4 w-full'>
      {contextHolder}
      <SectionTitle title='Dashboard' />
      <Divider className='dark:bg-white/10' />
      <DashboardTitle title='Activities' />
      <section className='flex items-start justify-start flex-wrap gap-3'>
        <Card
          type='inner'
          size='default'
          className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
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
          className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
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
          className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
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
          className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm h-24 md:h-auto flex flex-col items-start justify-start rounded-md w-full sm:w-2/5 lg:w-1/5 border-1 border-black/20 dark:border-white'
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
            <Card
              type='inner'
              // title={item?.node?.id}
              onClick={() => navigate("/dashboard/b2b/orders")}
              size='default'
              className='dark:bg-slate-100 py-0 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm border-1 border-black/20 dark:border-white'
              key={item?.id}
            >
              <section>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-bold flex items-center text-md'>
                      {/* <MdOutlineAddLocationAlt /> */}
                      <span className='uppercase'>Order No:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.orderNumber || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-2/5'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Date:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {item?.node?.date?.split("T")[0] || "N/A"}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-bold flex items-center text-md'>
                      {/* <MdOutlineAddLocationAlt /> */}
                      <span className='uppercase'>Quantity:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.quantity || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-2/5'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Amount:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {(item?.node?.amount && (
                        <DisplayPrice price={Math.floor(item?.node?.amount)+".00"} />
                      )) ||
                        "N/A"}
                    </span>
                  </div>
                </div>

                {/* <div className="flex items-center justify-between w-full">
                  <div className="flex flex-col my-2 w-full">
                    <h3 className="font-bold flex items-center text-md">
                      <span className="uppercase">Oversold Items:</span>
                    </h3>
                    <span className="font-semibold text-gray-600">
                      {item?.node?.oversoldItems || "N/A"}
                    </span>
                  </div>
                </div> */}

             
                <div className='flex items-start justify-between w-full'>
                  <div className='flex flex-col my-2 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Order status:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.orderStatus?.toUpperCase() || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Payment status:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.paymentStatus?.toUpperCase() || "N/A"}
                    </span>
                  </div>
                </div>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Phone Number:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {item?.node?.user?.phoneNumber || "N/A"}
                    </span>
                  </div>
                  {/* <div className="flex flex-col my-2">
                    <h3 className="font-bold flex items-center text-md">
                      <span className="uppercase">Order Status:</span>
                    </h3>
                    <span className="font-semibold text-gray-600 flex items-center gap-x-1">
                      {item?.node?.orderStatus || "N/A"}
                    </span>
                  </div> */}
                </div>

              </section>
            </Card>
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
              className='dark:bg-slate-100 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm  md:h-auto flex flex-col items-start justify-start rounded-md border-1 border-black/20 dark:border-white'
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
          md: 4,
          lg: 4,
          xl: 4,
        }}
        dataSource={localActivites?.productTopToday?.edges}
        renderItem={(item) => (
          <List.Item>
            <Card
              type='inner'
              size='default'
              className='dark:bg-slate-100 py-0 shadow-sm cursor-pointer hover:shadow-md hover:-translate-y-1 duration-200 dark:shadow-black dark:shadow-sm border-1 border-black'
            >
              <section>
                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-bold flex items-center text-md'>
                      {/* <MdOutlineAddLocationAlt /> */}
                      <span className='uppercase'>Order No:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.orderNumber || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-2/5'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Date:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {item?.node?.date?.split("T")[0] || "N/A"}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-bold flex items-center text-md'>
                      {/* <MdOutlineAddLocationAlt /> */}
                      <span className='uppercase'>Quantity:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.quantity || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-2/5'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Amount:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {(item?.node?.amount && (
                        <DisplayPrice price={item?.node?.amount} />
                      )) ||
                        "N/A"}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Oversold Items:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.oversoldItems || "N/A"}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-1/2'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Phone Number:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {item?.node?.user?.phoneNumber || "N/A"}
                    </span>
                  </div>
                  <div className='flex flex-col my-2 w-2/5'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Type:</span>
                    </h3>
                    <span className='font-semibold text-gray-600 flex items-center gap-x-1'>
                      {item?.node?.phoneNumberType || "N/A"}
                    </span>
                  </div>
                </div>

                <div className='flex items-center justify-between w-full'>
                  <div className='flex flex-col my-2 w-full'>
                    <h3 className='font-bold flex items-center text-md'>
                      <span className='uppercase'>Message:</span>
                    </h3>
                    <span className='font-semibold text-gray-600'>
                      {item?.node?.message || "No message available"}
                    </span>
                  </div>
                </div>
              </section>
            </Card>
          </List.Item>
        )}
      />
      <Divider className='dark:bg-white/10' />
    </section>
  );
};

export default Dashboard;
