import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register({
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
});
const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Biểu đồ thống kê doanh thu của từng khóa học",
    },
  },
};
const BarChart = ({ courseRevenueStats }) => {
  const labels = courseRevenueStats?.map((value) => {
    return value?.course_name;
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu",
        data: courseRevenueStats?.map((value) => {
          return value.revenue;
        }),
        backgroundColor: "#3b82f6",
      },
    ],
  };
  return (
    <>
      <Bar options={options} data={data}></Bar>
    </>
  );
};
export default BarChart;
