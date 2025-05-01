import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PageContainer from '@/components/PageContainer';

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer>
      <div className="min-h-[80vh] flex items-center justify-center font-inter">
        <div className="text-center">
          <h1 className="font-bold text-[32px] text-[#A4B1B7] mb-4">404</h1>
          <p className="font-normal text-[16px] text-[#A4B1B7] mb-4">Oops! Page not found</p>
          <button 
            onClick={() => navigate('/')} 
            className="text-[#A4B1B7] hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
