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
        errors.errorFullName = "Họ tên không được bỏ trống!";
        isValid = false;
      } else if (fullName.trim().length < 3 || fullName.trim().length > 50) {
        errors.errorFullName = "Họ tên phải từ 3 đến 50 ký tự! ";
        isValid = false;
      } else if (!onlyAlphaRegex.test(fullName.trim())) {
        errors.errorFullName = "Họ tên không được chứa số hoặc ký tự đặc biệt!";
        isValid = false;
      }
    }

    // 2. Kiểm tra Email
    if (!email) {
      errors.errorEmail = "Email không được bỏ trống!";
      isValid = false;
    } else if (!emailRegex.test(email)) {
      errors.errorEmail = "Email không đúng định dạng!";
      isValid = false;
    }

    // 3. Kiểm tra Password
    if (!password) {
      errors.errorPassword = "Mật khẩu không được bỏ trống!";
      isValid = false;
    } else if (password.length < 6) {
      errors.errorPassword = "Mật khẩu phải có tối thiểu 6 ký tự!";
      isValid = false;
    }

    // Cập nhật state lỗi và trả về kết quả
    if (!isValid) {
      setError((prev) => ({ ...prev, ...errors }));
    }
    return isValid;
  },
  validateFormCourse: ({ courseInfo, setError }) => {
    setError({
      errorCourseName: "",
      errorDescription: "",
      errorCategory: "",
      errorLevel: "",
      errorFile: "",
      errorPrice: "",
    });
    let errors = {};
    const alphaNumericRegex =
      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
    const onlyNumberRegex = /^[0-9]+$/;
    const allowedFormats = ["image/jpg", "image/jpeg", "image/png"];
    let isValid = true;
    //Kiểm tra tên khóa học
    if (!courseInfo.courseName.trim()) {
      errors.errorCourseName = "Tên khóa học không được bỏ trống!";
      isValid = false;
    } else if (
      courseInfo.courseName.trim().length < 3 ||
      courseInfo.courseName.trim().length > 50
    ) {
      errors.errorCourseName = "Tên khóa học phải từ 3 đến 50 ký tự!";
      isValid = false;
    } else if (!alphaNumericRegex.test(courseInfo.courseName)) {
      errors.errorCourseName = "Tên khóa học không được chứa ký tự đặt biệt!";
      isValid = false;
    }
    //Kiểm tra danh mục
    if (!courseInfo.category_id) {
      errors.errorCategory = "Vui lòng chọn danh mục!";
      isValid = false;
    }
    //Kiểm tra cấp độ
    if (!courseInfo.level) {
      errors.errorLevel = "Vui lòng chọn cấp độ!";
      isValid = false;
    }
    //Kiểm tra ảnh khóa học và ảnh bìa
    if (!courseInfo.image || !courseInfo.thumbnail) {
      errors.errorFile = "Vui lòng chọn ảnh!";
      isValid = false;
    } else if (
      courseInfo.image?.size > 300000 ||
      courseInfo.thumbnail?.size > 300000
    ) {
      errors.errorFile = "Kích thước ảnh tối đa 300KB!";
      isValid = false;
    } else if (
      !allowedFormats.includes(courseInfo.image?.type) ||
      !allowedFormats.includes(courseInfo.thumbnail?.type)
    ) {
      errors.errorFile = "Định dạng ảnh không hợp lệ!";
      isValid = false;
    }
    //Kiểm tra giá
    if (!onlyNumberRegex.test(courseInfo.price)) {
      errors.errorPrice = "Vui lòng nhập đúng định dạng giá!";
      isValid = false;
    }
    if (!isValid) setError((prev) => ({ ...prev, ...errors }));
    return isValid;
  },
};
