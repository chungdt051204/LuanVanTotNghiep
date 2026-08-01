import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({});
import categoryEntity from "../models/categoryModel.js";
import courseEntity from "../models/courseModel.js";
import userEntity from "../models/userModel.js";
import enrollmentEntity from "../models/enrollmentModel.js";
export class AiController {
  sendMessage = async (req, res) => {
    try {
      const { input } = req.body;
      const payload = req.payload;
      console.log(input);
      const intents = {
        GREETING: {
          description: "Chào hỏi, giao tiếp xã giao",
          entities: [],
        },
        SEARCH_COURSE: {
          description: "Tìm kiếm khóa học theo tên, danh mục, hoặc giảng viên",
          entities: ["courseName", "categoryName", "instructorName"],
        },
        LEARNING_PROGRESS: {
          description: "Xem tiến độ học tập",
          entities: [],
        },
        PROGRAMMING_QUESTION: {
          description: "Giải thích kiến thức lập trình",
          entities: ["technology"],
        },

        OUT_OF_SCOPE: {
          description: "Ngoài phạm vi hỗ trợ",
          entities: [],
        },
      };
      const message = `Đây là input của người dùng: ${input}. Hãy phân tích input và trả về cho tôi từ khóa nằm trong các intent sau: ${JSON.stringify(
        intents
      )}. Chỉ trả về data dạng object ko giải thích gì thêm`;
      let interaction = await ai.interactions.create({
        model: "gemini-3.1-flash-lite",
        input: message,
      });
      interaction = JSON.parse(interaction.output_text);
      console.log(interaction);
      const intent = interaction?.intent;
      let result = "";
      let prompt = "";
      switch (intent) {
        case "GREETING":
          result =
            "Xin chào, tôi là trợ lý AI, tôi có thể giúp được gì cho bạn";
          break;
        case "SEARCH_COURSE":
          const courseName = interaction?.entities?.courseName;
          const categoryName = interaction?.entities?.categoryName;
          const instructorName = interaction?.entities?.instructorName;
          let query = {};
          if (courseName)
            query.course_name = { $regex: courseName, $options: "i" };
          else if (categoryName) {
            const categories = await categoryEntity.find({
              category_name: {
                $regex: categoryName,
                $options: "i",
              },
            });
            const categoryIds = categories?.map((value) => {
              return value?._id;
            });
            query.category_id = {
              $in: categoryIds,
            };
          } else if (instructorName) {
            const instructor = await userEntity.findOne({
              full_name: { $regex: instructorName, $options: "i" },
            });
            query.user_id = instructor?._id;
          }
          const courses = await courseEntity
            .find({
              ...query,
              status: "approved",
              is_visible: true,
            })
            .select(
              "course_name description level price rating_star user_id category_id"
            )
            .populate("user_id", "full_name")
            .populate("category_id", "category_name");
          console.log(courses);
          prompt = `Đây là kết quả tìm kiếm khóa học ${courses}. Hãy chọn lọc thông tin và liệt kê theo từng gạch đầu dòng, mỗi gạch đầu dòng đều phải xuống dòng, không sử dụng ký tự sao`;
          break;
        case "LEARNING_PROGRESS":
          const enrollments = await enrollmentEntity
            .find({
              user_id: payload.sub,
            })
            .select(
              "course_id access_level total_lessons completed_lessons progress_percent"
            )
            .populate("course_id", "course_name");
          prompt = `Đây là danh sách khóa học đã đăng ký và tiến độ học tập của người dùng ${enrollments}. Hãy chọn lọc thông tin và liệt kê theo từng gạch đầu dòng, mỗi gạch đầu dòng đều phải xuống dòng, không sử dụng ký tự sao. Mỗi item cách 1 dòng`;
          break;
        case "PROGRAMMING_QUESTION":
          prompt = `Đây là input của người dùng: ${input}. Hãy trình bày ngắn gọn, không sử dụng ký tự đặc biệt *`;
          break;
        case "OUT_OF_SCOPE":
          result = "Ngoài phạm vi hỗ trợ, tôi không thể trả lời câu hỏi này";
        default:
          break;
      }
      console.log(prompt);
      if (prompt) {
        result = await ai.interactions.create({
          model: "gemini-3.1-flash-lite",
          input: prompt,
        });
      }
      return res
        .status(200)
        .json({ data: prompt ? result?.output_text : result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống!" });
    }
  };
}
