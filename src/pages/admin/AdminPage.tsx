
import { useLocation } from "react-router-dom";

interface AdminPageProps {
  title: string;
}

const AdminPage = ({ title }: AdminPageProps) => {
  const location = useLocation();
  const path = location.pathname.split("/").pop();
  
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <div className="border rounded-lg p-8 text-center bg-white">
        <p className="text-lg text-gray-500">
          This is a placeholder for the <strong>{path}</strong> admin page.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Content for this page would be implemented based on specific requirements.
        </p>
      </div>
    </div>
  );
};

export default AdminPage;
