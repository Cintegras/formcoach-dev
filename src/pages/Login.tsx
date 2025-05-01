
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/components/PageContainer';
import { CardGradient, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card-gradient';
import { Input } from '@/components/ui/input';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would authenticate here
    navigate('/welcome');
  };

  return (
    <PageContainer className="flex flex-col justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          FormCoach
        </h1>
      </div>
      
      <CardGradient>
        <CardHeader>
          <CardTitle>{isLogin ? 'Log In' : 'Create Account'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-700/50 border-gray-600 text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <PrimaryButton type="submit">
              {isLogin ? 'Log In' : 'Create Account'}
            </PrimaryButton>
            <div className="text-center text-sm text-gray-400">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)} 
                className="ml-1 text-teal-400 hover:underline"
              >
                {isLogin ? 'Sign Up' : 'Log In'}
              </button>
            </div>
          </CardFooter>
        </form>
      </CardGradient>
    </PageContainer>
  );
};

export default Login;
