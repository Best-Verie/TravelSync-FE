
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Cta = () => {
  return (
    <section className="py-16 px-6 bg-eco-700 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Beauty of Rwanda</h2>
        <p className="text-xl mb-8 opacity-90">
          Join our platform today — whether you're visiting Rwanda or a young Rwandan wanting to be part of our tourism community
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" className="bg-white text-eco-700 hover:bg-gray-100">
            <Link to="/experience/1" className="w-full h-full inline-flex items-center justify-center">
              Book an Experience
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-eco-600">
            <Link to="/register" className="w-full h-full inline-flex items-center justify-center">
              Register as Guide
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
