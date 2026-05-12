export const validateForm = {
  validateFormAuth: ({ fullName, email, password, setError }) => {
    // Reset các lỗi cũ trước khi check
    setError({ errorFullName: "", errorEmail: "", errorPassword: "" });
    let errors = {};
    const onlyAlphaRegex =
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    // 1. Kiểm tra Họ tên (Chỉ check nếu có fullName )
    if (fullName !== undefined) {
      if (!fullName.trim()) {
        errors.errorFullName = "Họ tên không được bỏ trống";
        isValid = false;
      } else if (fullName.trim().length < 3 || fullName.trim().length > 50) {
        errors.errorFullName = "Họ tên phải từ 3 đến 50 ký tự ";
        isValid = false;
      } else if (!onlyAlphaRegex.test(fullName.trim())) {
        errors.errorFullName = "Họ tên không được chứa số hoặc ký tự đặc biệt";
        isValid = false;
      }
    }

    // 2. Kiểm tra Email
    if (!email) {
      errors.errorEmail = "Email không được bỏ trống";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.errorEmail = "Email không đúng định dạng";
      isValid = false;
    }

    // 3. Kiểm tra Password
    if (!password) {
      errors.errorPassword = "Mật khẩu không được bỏ trống";
      isValid = false;
    } else if (password.length < 6) {
      errors.errorPassword = "Mật khẩu phải có tối thiểu 6 ký tự";
      isValid = false;
    }

    // Cập nhật state lỗi và trả về kết quả
    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }
    return isValid;
  },
};
