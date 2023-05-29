import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import config from "../utils/config.js";
import Image from "next/image.js";
import management from "../assests/RrRCCRrr.png";
import Footer from "@/components/footer.jsx";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { push } = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    setLoading(true);
    let postData = {
      email: data.email.trim(),
      password: data.password.trim(),
    };
    axios
      .post(`${config.baseUrl}/auth/signin`, postData)
      .then((res) => {
        toast.success("Successfully Logged In !");
        localStorage.setItem("user", JSON.stringify(res.data.user));
        push("/admindashboard");
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
            <h3>Admin LogIn</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="login-input">
                <input
                  {...register("email", {
                    required: true,
                  })}
                  placeholder="Email"
                  type="text"
                  className="form-control"
                />
                {errors.email && (
                  <div className="err-msg">Email is Required</div>
                )}
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
                {errors.password && (
                  <div className="err-msg">Password is Required</div>
                )}
              </div>
              <p className="mt-2 d-flex justify-content-end">
                <Link href="/forgotpassword" target="_blank">
                  forgotten password ?
                </Link>
              </p>
              <div className="login-bottom">
                <button type="submit" className="submit mb-3">
                  Sign In
                </button>
                <p>
                  Don&apos;t have account? <Link href="/signup">SignUp</Link>
                </p>

                <p>
                  <Link href="/studentlogin">Student LogIn?</Link>
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
