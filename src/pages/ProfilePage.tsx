
import React, { useState } from 'react';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Mail, Lock, LogOut, User } from 'lucide-react';

const ProfilePage = () => {
  // This would be replaced with actual user data from authentication
  const [user, setUser] = useState({
    email: 'user@example.com',
    name: 'John Doe'
  });

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
      
      <div className="mt-8 flex flex-col items-center">
        {/* Profile Avatar */}
        <div className="bg-[#00C4B4] rounded-full w-20 h-20 flex items-center justify-center text-black text-2xl font-bold mb-4">
          {user.name.charAt(0)}
        </div>
        
        <h2 className="font-medium text-[20px] text-white">{user.name}</h2>
        <p className="text-[#A4B1B7] mb-8">{user.email}</p>

        {/* Account Settings */}
        <div className="w-full max-w-[300px] space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          >
            <User className="mr-2 text-[#00C4B4]" size={18} />
            Edit Profile Information
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          >
            <Mail className="mr-2 text-[#00C4B4]" size={18} />
            Change Email Address
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
          >
            <Lock className="mr-2 text-[#00C4B4]" size={18} />
            Change Password
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)] mt-8"
          >
            <LogOut className="mr-2 text-red-500" size={18} />
            <span className="text-red-500">Sign Out</span>
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ProfilePage;
