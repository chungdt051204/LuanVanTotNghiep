import categoryEntity from "../models/categoryModel.js";
export class CategoryService {
  getAllCategories = async () => {
    const categories = await categoryEntity.find();
    return categories || [];
  };
}
