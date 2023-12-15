import React, { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import SectionTitle from "../../../components/Title/SectionTitle";
import { Card, Divider, Spin, Input, Skeleton, Statistic } from "antd";
import Spinner from "../../../components/Spinner/Spinner";
import DisplayPrice from "../../../components/Utils/DisplayPrice";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_MCX_PREMIUMS, GET_MCX_RATES } from "../../../GraphQl/Query";
import CurrencyPrefix from "../../../components/Utils/CurrencyPrefix";
import { SET_METAL_RATES } from "../../../GraphQl/Mutations";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
    className='dark:text-white'
  />
);
const PriceCard = (props) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(props?.loading);
  const [value, setValue] = useState(props?.premium);
  const [updatePremium, updatedPremium] = useMutation(SET_METAL_RATES, {
    onCompleted: (data) => {
      alert("Premium updated successfully");
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  const handleChange = (e) => {
    let val = e.target.value;
    if (val === "" || val === undefined || val === null || val < 0) setValue(0);
    else setValue(val);
  };
  return (
    <Card
      title={<span className='dark:text-white'>{props?.title}</span>}
      extra={
        <span
          className='text-blue-600 cursor-pointer font-semibold dark:text-white '
          onClick={() => {
            if (props?.title?.toUpperCase()?.includes("GOLD"))
              updatePremium({
                variables: {
                  gold24kPremium: parseFloat(value),
                },
              });
            else if (props?.title?.toUpperCase()?.includes("SILVER"))
              updatePremium({
                variables: {
                  silver999kPremium: parseFloat(value),
                },
              });
            else if (props?.title?.toUpperCase()?.includes("PLATINUM"))
              updatePremium({
                variables: {
                  platinum999kPremium: parseFloat(value),
                },
              });
          }}
        >
          {!loading && (edit ? "Edit" : "Save")}
          {loading && <Spin indicator={antIcon} />}
        </span>
      }
      className='w-full md:w-[40%] lg:w-[30%] dark:bg-slate-600'
    >
      <section className='flex flex-wrap items-start justify-around w-full '>
        <div className='priceDiv w-1/2'>
          <h4 className='font-semibold text-md dark:text-slate-200'>Price</h4>
          <h2 className='text-lg font-semibold'>
            <DisplayPrice price={props?.price} className='dark:text-white' />
          </h2>
        </div>
        <div className='priceDiv w-1/2'>
          <h4 className='font-semibold text-md dark:text-slate-200'>Premium</h4>
          <Input
            type='number'
            bordered={true}
            className={
              "priceCard text-lg font-semibold w-full border-b-2 border-b-transparent focus:outline-none duration-border-200 disabled:bg-transparent disabled:text-black appearance-none dark:text-black" +
              +" " +
              (!edit &&
                "border-b-black/10 bg-transparent outline-none  border-b-2 border-b-blue-300")
            }
            min={0}
            allowClear
            value={value}
            onChange={handleChange}
            prefix={<CurrencyPrefix />}
          />
        </div>
      </section>
    </Card>
  );
};

const Prices = () => {
  const [fetchMCXRates, mcx] = useLazyQuery(GET_MCX_RATES);
  const [fetchMCXPremiums, premium] = useLazyQuery(GET_MCX_PREMIUMS);

  useEffect(() => {
    fetchMCXRates();
    fetchMCXPremiums();
  }, []);
  return (
    <div>
      <SectionTitle title='MCX Rates' />
      <Divider className='dark:bg-white/10' />
      {/* <SectionTitle title="Gold" /> */}

      <section className='w-full cardLayout flex flex-wrap items-center justify-start gap-4'>
        {mcx?.loading &&
          Array(3)
            ?.fill(0)
            ?.map((item) => (
              // <ProductCard product={product} key={product?.node?.id} />
              <Card className='w-full md:w-[45%] lg:w-[30%] scale-95 flex flex-col gap-y-2'>
                <div className='mt-2'>
                  <Skeleton active />
                </div>
              </Card>
            ))}

        {mcx?.data?.mcxRates?.map((rate) => (
          <PriceCard
            title={rate?.Name}
            loading={false}
            price={rate?.Close}
            premium={
              rate?.Name?.toUpperCase()?.includes("GOLD")
                ? premium?.data?.metalRates?.gold24kPremium
                : rate?.Name?.toUpperCase()?.includes("SILVER")
                ? premium?.data?.metalRates?.silver999kPremium
                : premium?.data?.metalRates?.platinum999kPremium
            }
          />
        ))}
        {(mcx?.data?.mcxRates?.length < 1 || mcx?.error) && (
          <h3 className='text-md font-bold text-red-500'>
            No Rates Found!{" "}
            <span
              className=' hover:underline cursor-pointer'
              onClick={() => fetchMCXRates()}
            >
              Retry
            </span>
          </h3>
        )}
      </section>
      <Divider className='dark:bg-white/10' />
    </div>
  );
};

export default Prices;
