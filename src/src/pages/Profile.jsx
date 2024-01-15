import React from "react";
import SectionTitle from "../components/Title/SectionTitle";
import { Divider } from "antd";

const Profile = () => {
  const profile = JSON.parse(localStorage?.getItem("vjw-ad-user"));

  return (
    <section className='py-4'>
      <SectionTitle title='Profile' />
      <Divider className='dark:bg-white/10' />
      <section className='flex flex-col items-center justify-center min-h-[60vh] '>
        <div className='h-32 w-32 rounded-full object-fit'>
          <img
            src={profile?.avatar?.url || "/blank.webp"}
            className='h-full w-full rounded-full object-contain'
            alt=''
          />
        </div>
        <div className='flex flex-col my-4 items-center justify-center gap-y-3'>
          <span className='text-2xl font-semibold'>
            {profile?.user?.firstName || "First Name "}{" "}
            {profile?.user?.lastName || "Last Name Unavailable"}
          </span>
          <span className='text-2xl font-semibold'>
            {profile?.user?.phoneNumber}
          </span>
        </div>
      </section>
    </section>
  );
};

export default Profile;
