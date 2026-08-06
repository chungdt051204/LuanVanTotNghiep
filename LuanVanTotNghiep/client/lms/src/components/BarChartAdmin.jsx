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
      text: "Biểu đồ thống kê doanh thu trong 7 ngày gần nhất",
    },
  },
};
const BarChart = ({ array }) => {
  const labels = array?.map((value) => {
    return value?._id;
  });
  const data = {
    labels,
    datasets: [
      {
        label: "Tổng doanh thu",
        data: array?.map((value) => {
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
