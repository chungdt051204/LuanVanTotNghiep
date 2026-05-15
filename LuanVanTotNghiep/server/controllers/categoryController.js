import { CategoryService } from "../services/categoryService.js";

export class CategoryController {
  getAllCategories = async (req, res) => {
    try {
      const result = await new CategoryService().getAllCategories();
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
