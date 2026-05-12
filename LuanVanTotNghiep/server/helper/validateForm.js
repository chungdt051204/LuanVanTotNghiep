export const validateForm = {
  validateFormAuth: ({ data }) => {
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // 1. Kiểm tra Họ tên (Chỉ check nếu có fullName )
    if (data.fullName !== undefined) {
      if (!data.fullName.trim()) {
        const error = new Error("Họ tên không được bỏ trống!");
        error.statusCode = 422;
        isValid = false;
        throw error;
      } else if (
        data.fullName.trim().length < 3 ||
        data.fullName.trim().length > 50
      ) {
        const error = new Error("Họ tên phải từ 3 đến 50 ký tự!");
        error.statusCode = 422;
        isValid = false;
        throw error;
      } else if (!onlyAlphaRegex.test(data.fullName.trim())) {
        const error = new Error(
          "Họ tên không được chứa số hoặc ký tự đặc biệt!"
        );
        error.statusCode = 422;
        isValid = false;
        throw error;
      }
    }

    // 2. Kiểm tra Email
    if (!data.email) {
      const error = new Error("Email không được bỏ trống");
      error.statusCode = 422;
      isValid = false;
      throw error;
    } else if (!emailRegex.test(data.email)) {
      const error = new Error("Email không đúng định dạng");
      error.statusCode = 422;
      isValid = false;
      throw error;
    }

    // 3. Kiểm tra Password
    if (!data.password) {
      const error = new Error("Mật khẩu không được bỏ trống");
      error.statusCode = 422;
      isValid = false;
      throw error;
    } else if (data.password.length < 6) {
      const error = new Error("Mật khẩu phải có tối thiểu 6 ký tự");
      error.statusCode = 422;
      isValid = false;
      throw error;
    }
    return isValid;
  },
};
