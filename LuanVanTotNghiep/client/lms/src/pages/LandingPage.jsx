import { useSelector } from "react-redux";
import Navbar from "../components/NavBar";

const LandingPage = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);

  return (
    <>
      <Navbar />
      {isLogin && me && <h2>Xin chào {me.full_name}</h2>}
    </>
  );
};
export default LandingPage;
