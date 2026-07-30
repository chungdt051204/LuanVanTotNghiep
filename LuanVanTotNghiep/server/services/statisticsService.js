import courseEntity from "../models/courseModel.js";
import enrollmentEntity from "../models/enrollmentModel.js";
import orderItemEntity from "../models/orderItemModel.js";
import orderEntity from "../models/orderModel.js";
import userEntity from "../models/userModel.js";
import roleEntity from "../models/roleModel.js";
import dayjs from "dayjs";
export class StatisticsService {
  getStatisticsByInstructor = async ({ instructorId }) => {
    const courses = await courseEntity.find({ user_id: instructorId });
    const courseIds = courses?.map((value) => {
      return value._id;
    });
    const studentIds = await enrollmentEntity.distinct("user_id", {
      course_id: { $in: courseIds },
    }); //Lấy danh sách đơn đăng ký các khóa học giảng viên đã tạo, không lấy trùng user_id
    const courseRevenueStats = await orderItemEntity.aggregate([
      {
        $match: { course_id: { $in: courseIds } },
      },
      {
        $lookup: {
          from: "Course",
          localField: "course_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: "$course._id",
          course_name: { $first: "$course.course_name" },
          revenue: {
            $sum: "$applied_amount",
          },
        },
      },
      {
        $sort: {
          revenue: 1,
        },
      },
    ]);
    const top5HighRatingCourses = await courseEntity
      .find({ _id: { $in: courseIds }, rating_star: { $gte: 4.5 } })
      .sort({ rating_star: -1 })
      .limit(5);
    return {
      totalCourses: courses?.length,
      totalStudents: studentIds?.length,
      courseRevenueStats,
      top5HighRatingCourses: top5HighRatingCourses?.filter(
        (value) => value.rating_star != 0
      ),
    };
  };
  getStatisticsByAdmin = async () => {
    const startDay = dayjs().subtract(30, "day").toDate();
    const totalCourses = await courseEntity.countDocuments();
    const instructorRole = await roleEntity.findOne({ role: "instructor" });
    const userRole = await roleEntity.findOne({ role: "user" });
    const totalInstructors = await userEntity.countDocuments({
      role_id: instructorRole._id,
    });
    const totalUsers = await userEntity.countDocuments({
      role_id: userRole._id,
    });
    const orders = await orderEntity.find();
    let totalRevenue = 0;
    const orderItems = await orderItemEntity.find();
    orderItems?.forEach((value) => {
      totalRevenue = totalRevenue + value.applied_amount;
    });
    const revenueStats = await orderEntity.aggregate([
      {
        $match: {
          $and: [
            {
              payment_status: {
                $in: ["PARTIAL_PAID", "PAID"],
              },
            },
            {
              updatedAt: { $gte: startDay },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" },
          },
          revenue: {
            $sum: "$applied_amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const top5BestSellerCourses = await orderItemEntity.aggregate([
      {
        $lookup: {
          from: "Order",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $match: {
          "order.payment_status": { $in: ["PAID", "PARTIAL_PAID"] },
        },
      },
      {
        $lookup: {
          from: "Course",
          localField: "course_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: "$course._id",
          data: { $first: "$course" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    const top5HighestRevenueCourses = await orderItemEntity.aggregate([
      {
        $lookup: {
          from: "Order",
          localField: "order_id",
          foreignField: "_id",
          as: "order",
        },
      },
      {
        $unwind: "$order",
      },
      {
        $match: {
          "order.payment_status": { $in: ["PAID", "PARTIAL_PAID"] },
        },
      },
      {
        $lookup: {
          from: "Course",
          localField: "course_id",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: "$course",
      },
      {
        $group: {
          _id: "$course._id",
          data: { $first: "$course" },
          revenue: { $sum: "$applied_amount" },
        },
      },
      {
        $sort: {
          revenue: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);
    const top5HighestRatingCourses = await courseEntity
      .find({ rating_star: { $gte: 4.5 } })
      .sort({ rating_star: -1 })
      .limit(5);
    return {
      totalCourses,
      totalInstructors,
      totalUsers,
      totalOrders: orders?.length,
      totalRevenue,
      revenueStats,
      top5BestSellerCourses,
      top5HighestRevenueCourses,
      top5HighestRatingCourses: top5HighestRatingCourses?.filter(
        (value) => value.rating_star != 0
      ),
    };
  };
}
