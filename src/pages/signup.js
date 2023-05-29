import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import config from "@/utils/config";
import Image from "next/image";
import management from "../assests/RrRCCRrr.png";
import Footer from "@/components/footer.jsx";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    fullName: yup.string().required("Full Name is a required field"),
    InstituteName: yup.string().required("Institute Name is a required field"),
    contactNumber: yup
      .string()
      .required("Contact Number is a required field")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "too short")
      .max(10, "too long"),
    email: yup.string().email().required(),
    password: yup.string().required("Password is required"),
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    setLoading(true);
    axios
      .post(`${config.baseUrl}/auth/signup`, data)
      .then((res) => {
        toast.success("Your Profile has been Created !");
        push("/login");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <>
      {loading && (
        <div className="loader">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
      <div className="two-sec">
        <div className="left-sec">
          <div className="login-img-wrapper d-flex justify-content-center align-items-center">
            <Image src={management} alt="img" height={220} width={220} />
          </div>
        </div>
        <div className="right-sec">
          <div className="right-content">
            <h1>SignUp</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="login-input">
                <input
                  {...register("fullName")}
                  placeholder="Full Name"
                  type="text"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.fullName?.message}</p>
              </div>
              <div className="login-input">
                <input
                  {...register("InstituteName")}
                  placeholder="Institute Name"
                  type="text"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.InstituteName?.message}</p>
              </div>
              <div className="login-input">
                <input
                  {...register("contactNumber")}
                  placeholder="Contact Number"
                  type="number"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.contactNumber?.message}</p>
              </div>
              <div className="login-input">
                <input
                  {...register("email")}
                  placeholder="Email"
                  type="text"
                  className="form-control"
                />
                <p style={{ color: "red" }}>{errors.email?.message}</p>
              </div>
              <div className="login-input">
                <input
                  {...register("password", {
                    required: true,
                  })}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                />
                {showPassword ? (
                  <FaEye onClick={handlePassword} className="icon-group-end" />
                ) : (
                  <FaEyeSlash
                    onClick={handlePassword}
                    className="icon-group-end"
                  />
                )}
                <p style={{ color: "red" }}>{errors.password?.message}</p>
              </div>
              <div className="login-input">
                <input
                  {...register("passwordConfirmation", {
                    required: true,
                  })}
                  placeholder="Confirm Password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                />
                {showPassword ? (
                  <FaEye onClick={handlePassword} className="icon-group-end" />
                ) : (
                  <FaEyeSlash
                    onClick={handlePassword}
                    className="icon-group-end"
                  />
                )}
                <p style={{ color: "red" }}>
                  {errors.passwordConfirmation?.message}
                </p>
              </div>
              <div className="login-bottom">
                <button type="submit" className="submit mb-3">
                  Sign Up
                </button>
                <p>
                  Already have account?<Link href="/login"> LogIn</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
