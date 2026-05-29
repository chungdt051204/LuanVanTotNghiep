import { useSelector } from "react-redux";
import ListCourses from "../components/ListCourses";
import Navbar from "../components/Navbar";

const LandingPage = () => {
  const isLogin = useSelector((state) => state.auth.isLogin);
  const me = useSelector((state) => state.me.item);

  return (
    <>
      <Navbar />
      {isLogin && me && <h2>Xin chào {me.full_name}</h2>}
      <p>Danh sách khóa học</p>
      <ListCourses />
    </>
  );
};
export default LandingPage;
