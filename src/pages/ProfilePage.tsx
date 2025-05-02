
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Mail, Lock, LogOut, User, Scale, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

interface UserData {
  firstName: string;
  email: string;
  weight: string;
  height: string;
  age: string;
  sex: string;
  weightHistory?: { date: string; weight: string }[];
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isWeightDialogOpen, setIsWeightDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [user, setUser] = useState<UserData>({
    firstName: '',
    email: 'user@example.com',
    weight: '0',
    height: '0',
    age: '0',
    sex: ''
  });
  
  // Load user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      // If no user data found, redirect to profile setup
      const userEmail = localStorage.getItem('userEmail');
      if (userEmail) {
        navigate('/profile-setup');
      }
    }
  }, [navigate]);

  const handleUpdatePassword = () => {
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match",
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, this would call an API to update the password
    toast({
      title: "Success",
      description: "Password updated successfully"
    });
    
    setIsPasswordDialogOpen(false);
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleUpdateWeight = () => {
    if (!newWeight || isNaN(Number(newWeight)) || Number(newWeight) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid weight",
        variant: "destructive"
      });
      return;
    }
    
    // Update user weight
    const updatedUser = { ...user };
    updatedUser.weight = newWeight;
    
    // Update weight history
    if (!updatedUser.weightHistory) {
      updatedUser.weightHistory = [];
    }
    
    updatedUser.weightHistory.push({
      date: new Date().toISOString(),
      weight: newWeight
    });
    
    // Save updated user data
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    toast({
      title: "Success",
      description: "Weight updated successfully"
    });
    
    setIsWeightDialogOpen(false);
    setNewWeight("");
  };

  const handleSignOut = () => {
    // In a real app with auth service, this would log the user out
    // For now, we'll just redirect to login
    toast({
      title: "Signed out",
      description: "You have been signed out successfully"
    });
    navigate('/login');
  };

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
          {user.firstName ? user.firstName.charAt(0) : '?'}
        </div>
        
        <h2 className="font-medium text-[20px] text-white">{user.firstName || 'User'}</h2>
        <p className="text-[#A4B1B7] mb-2">{user.email}</p>
        
        {/* User Stats */}
        <div className="flex gap-4 mb-8 text-sm text-[#A4B1B7]">
          <div>Height: {user.height}″</div>
          <div>Weight: {user.weight} lbs</div>
          <div>Age: {user.age}</div>
        </div>

        {/* Account Settings */}
        <div className="w-full max-w-[300px] space-y-4">
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
            onClick={() => setIsWeightDialogOpen(true)}
          >
            <Scale className="mr-2 text-[#00C4B4]" size={18} />
            Update Weight
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)]"
            onClick={() => setIsPasswordDialogOpen(true)}
          >
            <Lock className="mr-2 text-[#00C4B4]" size={18} />
            Change Password
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start bg-[rgba(176,232,227,0.12)] border-none text-white hover:bg-[rgba(176,232,227,0.2)] mt-8"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 text-red-500" size={18} />
            <span className="text-red-500">Sign Out</span>
          </Button>
        </div>
        
        {/* Weight history if available */}
        {user.weightHistory && user.weightHistory.length > 1 && (
          <div className="w-full max-w-[300px] mt-8">
            <h3 className="text-[#B0E8E3] text-lg mb-2">Weight History</h3>
            <div className="bg-[rgba(176,232,227,0.12)] rounded-lg p-4">
              <div className="space-y-2">
                {user.weightHistory.slice().reverse().slice(0, 5).map((entry, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-[#A4B1B7]">
                      {format(new Date(entry.date), 'MMM d, yyyy')}
                    </span>
                    <span className="text-white">{entry.weight} lbs</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#B0E8E3]">Change Password</DialogTitle>
            <DialogDescription className="text-[#A4B1B7]">
              Enter your new password below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">New Password</label>
              <Input 
                type="password" 
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">Confirm Password</label>
              <Input 
                type="password" 
                placeholder="******"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsPasswordDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdatePassword}
              className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
            >
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Weight Update Dialog */}
      <Dialog open={isWeightDialogOpen} onOpenChange={setIsWeightDialogOpen}>
        <DialogContent className="bg-[#0C1518] border-[#243137] text-white">
          <DialogHeader>
            <DialogTitle className="text-[#B0E8E3]">Update Weight</DialogTitle>
            <DialogDescription className="text-[#A4B1B7]">
              Enter your current weight below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm text-[#A4B1B7]">Weight (lbs)</label>
              <Input 
                type="number" 
                placeholder={user.weight || "150"}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                className="bg-[rgba(176,232,227,0.12)] border-0 text-white"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsWeightDialogOpen(false)}
              className="border-[#243137] text-[#A4B1B7] hover:bg-[#243137]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateWeight}
              className="bg-[#00C4B4] text-black hover:bg-[#00C4B4]/80"
            >
              Update Weight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
};

export default ProfilePage;
