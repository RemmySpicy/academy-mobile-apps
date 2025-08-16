import * as yup from "yup";

export const RegisterDataSchema = yup.object().shape({
  email: yup.string().required("Enter your email address"),
  first_name: yup.string().required("Enter your First Name"),
  last_name: yup.string().required("Enter your Last Name"),
  phone_number: yup.string().required("Enter your Phone Number"),
  gender: yup.string().required("Enter your Gender"),
  date_of_birth: yup.string().required("Enter your DOB"),
  parent_email: yup.string().required("Enter your email address"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "Password too weak",
    })
    .required("Enter  password"),
  confirm_password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "Password too weak",
    })
    .required("Confirm your password"),
});

export const LoginDataSchema = yup.object().shape({
  email: yup.string().required("Enter your email address"),
  password: yup.string().required("Enter your password"),
});

export const VerifyOtpDataSchema = yup.object().shape({
  otp: yup.string().required("Enter your otp"),
});

export const ForgetPasswordDataSchema = yup.object().shape({
  email: yup.string().required("Enter your email address"),
});

export const ResetPasswordDataSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: "Password too weak",
    })
    .required("Enter  password"),
});
