import Body from "../components/home/body";
import RecentlyAdded from "../components/home/RecentlyAdded";

const Home = () => {
  return (
    <div className="bg-purple-950 text-purple-100 px-10 py-8 min-h-screen">
      <Body />
      <RecentlyAdded />
    </div>
  );
};

export default Home;