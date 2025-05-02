
import React from 'react';
import PageContainer from '@/components/PageContainer';

const ProfilePage = () => {
  return (
    <PageContainer>
      <div className="mt-8 mb-6">
        <h1 className="font-bold text-[28px] text-center text-[#B0E8E3]">
          Profile
        </h1>
        <p className="font-normal text-[14px] text-[#A4B1B7] text-center mt-2">
          Manage your account settings
        </p>
      </div>
      <div className="flex flex-col items-center justify-center mt-10">
        <p className="text-[#A4B1B7] text-center">
          Your profile information and settings will appear here.
        </p>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
