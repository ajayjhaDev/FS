import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Spinner } from "react-bootstrap";
import config from "../utils/config.js";
import Image from "next/image.js";
import management from "../assests/management.jpg";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Footer from "@/components/footer.jsx";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const schema = yup
  .object({
    name: yup.string().required("Student Name is a required field"),
    parent_number: yup
      .string()
      .required("Parent Contact Number is a required field")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "too short")
      .max(10, "too long"),
  })
  .required();

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [StudentData, setStudentData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data) => {
    setLoading(true);

    data.name = data.name.trim();

    let user;
    user = StudentData.find((ele) => {
      return (
        ele.parentNumber == data.parent_number &&
        ele.studentName.toLowerCase() == data.name.toLowerCase()
      );
    });

    localStorage.setItem("studentData", JSON.stringify(user));

    if (user) {
      setLoading(false);
      push("/studentdashboard");
    } else {
      setLoading(false);
      toast.error("User doesn't exists !");
    }
  };

  useEffect(() => {
    axios.get(`${config.baseUrl}/api/getstudentsByUserId`).then((res) => {
      setStudentData(res.data.data);
    });
  }, []);

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
            <h3>Student LogIn</h3>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="login-input">
                <input
                  {...register("name", {
                    required: true,
                  })}
                  placeholder="Enter Student Name"
                  type="text"
                  className="form-control"
                />
                {errors.name && (
                  <div className="err-msg">Student Name is Required</div>
                )}
              </div>
              <div className="login-input">
                <input
                  {...register("parent_number", {
                    required: true,
                  })}
                  placeholder="Enter Parent Contact Number"
                  type={"number"}
                  className="form-control"
                />
                <div className="err-msg">{errors.parent_number?.message}</div>
              </div>
              <div className="login-bottom">
                <button type="submit" className="submit mb-3">
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
