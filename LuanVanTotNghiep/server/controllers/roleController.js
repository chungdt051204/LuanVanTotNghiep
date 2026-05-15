import { RoleService } from "../services/roleService.js";
export class RoleController {
  getAllRoles = async (req, res) => {
    try {
      const result = await new RoleService().getAllRoles();
      return res.status(200).json({ data: result });
    } catch (error) {
      const status = error.statusCode || 500;
      return res
        .status(status)
        .json({ message: error.message || "Lỗi hệ thống" });
    }
  };
}
