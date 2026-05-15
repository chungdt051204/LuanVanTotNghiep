import roleEntity from "../models/roleModel.js";
export class RoleService {
  getAllRoles = async () => {
    const roles = await roleEntity.find();
    return roles || [];
  };
  getRoleByName = async ({ name }) => {
    const role = await roleEntity.findOne({ role: name });
    if (!role) {
      const error = new Error("Hệ thống hiện không có vai trò này");
      error.statusCode = 404;
      throw error;
    }
    return role;
  };
}
