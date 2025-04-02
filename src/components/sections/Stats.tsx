
import { useEffect, useState } from "react";
import { statsApi } from "@/lib/api";

const Stats = () => {
  const [stats, setStats] = useState({
    totalUsers: "0",
    totalExperiences: "0",
    totalBookings: "0",
    satisfactionRate: "0%"
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statsApi.getAppStats();
        setStats({
          totalUsers: (data.totalUsers || 0).toString(),
          totalExperiences: (data.totalExperiences || 0).toString(),
          totalBookings: (data.totalBookings || 0).toString(),
          satisfactionRate: "96%" // This could be calculated in the future
        });
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    
    fetchStats();
  }, []);
  
  return (
    <section className="py-16 bg-eco-600 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">{stats.totalUsers}+</div>
            <p className="text-eco-100">Rwandan Youth Trained</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{stats.totalExperiences}+</div>
            <p className="text-eco-100">Experiences Offered</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{stats.totalBookings}+</div>
            <p className="text-eco-100">Tourist Experiences</p>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">{stats.satisfactionRate}</div>
            <p className="text-eco-100">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
