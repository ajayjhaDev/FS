import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import search from "../../assests/search.svg";
import StudentTables from "@/components/StudentTables";
import Button from "react-bootstrap/Button";
import AddStudentModal from "../../components/AddStudentModal";
import DeleteStudentModal from "../../components/DeleteStudentModal";
import axios from "axios";
import Select from "react-select";
import config from "@/utils/config";
import Footer from "@/components/footer";
import Link from "next/link";

const AdminDashboard = () => {
  const { push } = useRouter();
  const [hasMounted, setHasMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [isStudentAdded, setIsStudentAdded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [isStudentDeleted, setIsStudentDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [studentData, setStudentData] = useState([]);
  const [totalStudent, setTotalStudent] = useState(0);
  const [totalStudentData, setTotalStudentData] = useState([]);
  const [BackupstudentData, setBackupStudentData] = useState([]);
  const [BackupLength, setBackupLength] = useState(0);

  let options = [{ value: "All", label: "All" }];

  totalStudentData?.map((ele) => {
    options.push({ value: ele.cls, label: ele.cls });
  });

  const uniqueIds = [];

  const unique = options.filter((element) => {
    const isDuplicate = uniqueIds.includes(element.value);

    if (!isDuplicate) {
      uniqueIds.push(element.value);

      return true;
    }

    return false;
  });

  useEffect(() => {
    axios
      .get(
        `${config.baseUrl}/api/getstudentsByUserId?limit=${10}&&page=${page}`
      )
      .then((res) => {
        setStudentData(res.data.resultantData);
        setBackupStudentData(res.data.resultantData);
        setTotalStudent(res.data.total);
        setBackupLength(res.data.total);
        setTotalStudentData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [isStudentAdded, isStudentDeleted, page]);

  const handleDeleteClose = () => setShowDelete(false);
  const handleDeleteShow = (studentId) => {
    setShowDelete(true);
    setStudentId(studentId);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectChange = (val) => {
    console.log(val.value);

    if (val.value == "All") {
      setStudentData(BackupstudentData);
      setTotalStudent(BackupLength);
    } else {
      const filteredData = totalStudentData.filter((ele) =>
        ele.cls.toLowerCase().includes(val.value.toLowerCase())
      );

      setStudentData(filteredData);
      setTotalStudent(filteredData.length);
    }
  };

  const handleLogout = () => {
    push("/");
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }

  const handleChange = (e) => {
    const val = e.target.value;

    if (val.length <= 1) {
      setStudentData(BackupstudentData);
      setTotalStudent(BackupLength);
    } else {
      const filteredData = totalStudentData.filter((ele) =>
        ele.studentName.toLowerCase().includes(e.target.value.toLowerCase())
      );

      setStudentData(filteredData);
      setTotalStudent(filteredData.length);
    }
  };

  return (
    <>
      <AddStudentModal
        show={show}
        handleClose={handleClose}
        setShow={setShow}
        setIsStudentAdded={setIsStudentAdded}
        isStudentAdded={isStudentAdded}
        isStudentDeleted={isStudentDeleted}
      />

      <DeleteStudentModal
        handleDeleteClose={handleDeleteClose}
        showDelete={showDelete}
        studentId={studentId}
        setIsStudentDeleted={setIsStudentDeleted}
        isStudentDeleted={isStudentDeleted}
      />

      <div className="page-container">
        <div className="page-layout row">
          <div className="left-cnt col-1 mx-auto">
            <div className="logo first">IM</div>
            <ul className="sidebar-links second">
              <li onClick={() => push("/admindashboard")} className="mx-auto">
                <svg
                  width="27"
                  height="26"
                  viewBox="0 0 27 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M25.6399 11.3087L15.0322 0.701416C14.5802 0.249146 13.9791 0 13.3398 0C12.7005 0 12.0994 0.248947 11.6471 0.701218L1.04675 11.3014C1.04318 11.305 1.03961 11.3087 1.03604 11.3123C0.107693 12.246 0.10928 13.7609 1.0406 14.6922C1.46609 15.1179 2.02806 15.3645 2.6289 15.3903C2.6533 15.3927 2.6779 15.3939 2.70269 15.3939H3.12541V23.1989C3.12541 24.7434 4.38205 26 5.92691 26H10.0763C10.4968 26 10.838 25.659 10.838 25.2383V19.1191C10.838 18.4144 11.4113 17.8411 12.1161 17.8411H14.5635C15.2683 17.8411 15.8415 18.4144 15.8415 19.1191V25.2383C15.8415 25.659 16.1825 26 16.6033 26H20.7527C22.2975 26 23.5541 24.7434 23.5541 23.1989V15.3939H23.9461C24.5852 15.3939 25.1863 15.1449 25.6388 14.6926C26.5711 13.7597 26.5715 12.2422 25.6399 11.3087Z"
                    fill="white"
                  />
                </svg>
              </li>
            </ul>
            <ul className="sidebar-links third bottom-link">
              <li onClick={handleLogout}>
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.6939 20.5155V22.555C18.6939 24.8042 16.8641 26.634 14.6149 26.634H4.36628C2.11703 26.634 0.287231 24.8042 0.287231 22.555V4.60719C0.287231 2.35793 2.11703 0.528137 4.36628 0.528137H14.6149C16.8641 0.528137 18.6939 2.35793 18.6939 4.60719V6.64671C18.6939 7.20997 18.2374 7.66647 17.6742 7.66647C17.1109 7.66647 16.6544 7.20997 16.6544 6.64671V4.60719C16.6544 3.48266 15.7394 2.56766 14.6149 2.56766H4.36628C3.24175 2.56766 2.32676 3.48266 2.32676 4.60719V22.555C2.32676 23.6795 3.24175 24.5945 4.36628 24.5945H14.6149C15.7394 24.5945 16.6544 23.6795 16.6544 22.555V20.5155C16.6544 19.9522 17.1109 19.4957 17.6742 19.4957C18.2374 19.4957 18.6939 19.9522 18.6939 20.5155ZM25.6464 11.8294L23.3629 9.54586C22.9646 9.14752 22.3189 9.14752 21.9207 9.54586C21.5224 9.94401 21.5224 10.5897 21.9207 10.9879L23.545 12.6123H11.3007C10.7374 12.6123 10.2809 13.0688 10.2809 13.6321C10.2809 14.1953 10.7374 14.6518 11.3007 14.6518H23.545L21.9207 16.2763C21.5224 16.6744 21.5224 17.3202 21.9207 17.7183C22.1199 17.9175 22.3808 18.0171 22.6417 18.0171C22.9028 18.0171 23.1638 17.9175 23.3629 17.7183L25.6464 15.4348C26.6405 14.4407 26.6405 12.8234 25.6464 11.8294V11.8294Z"
                    fill="white"
                  />
                </svg>
              </li>
            </ul>
          </div>

          <section className="right-cnt col-11 row mx-auto">
            <div className="middle-sec col ms-md-3">
              <div className="box illustration-box">
                <div>
                  <h3>Hello Admin !</h3>
                  <p>It&apos;s good to see you again.</p>
                </div>

                <svg
                  width="175"
                  height="191"
                  viewBox="0 0 175 191"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_2_0)">
                    <path
                      d="M93.6877 20.0594C99.796 36.3923 119.787 33.9344 133.352 30.4458C136.605 29.5737 139.937 28.6222 142.872 26.9572C145.807 25.2922 148.266 22.5965 149.218 19.3458C150.249 15.6986 149.059 11.655 146.997 8.4836C145.093 5.55002 142.316 2.45786 139.381 0.554999C138.112 3.80573 133.59 4.04358 130.496 4.04358C126.133 4.04358 122.167 2.37858 118.121 1.18929C113.996 -3.39746e-06 109.553 -0.237861 105.428 0.872143C97.0988 2.85429 90.4352 11.3379 93.6877 20.0594Z"
                      fill="black"
                    />
                    <path
                      d="M106.142 129.395C105.904 129.395 105.825 129.395 105.666 129.474L106.142 129.395Z"
                      fill="black"
                    />
                    <path
                      d="M106.142 129.395C105.904 129.395 105.825 129.395 105.666 129.474L106.142 129.395Z"
                      fill="black"
                    />
                    <path
                      d="M88.5313 49.8709V34.5687C88.5313 21.5658 100.669 10.9415 115.503 10.9415C122.881 10.9415 129.624 13.5579 134.542 17.8393C139.461 22.1208 142.475 27.988 142.475 34.4894V49.7916"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M142.475 66.4417V84.1225C142.475 97.1254 130.338 107.75 115.503 107.75C100.669 107.75 88.5313 97.1254 88.5313 84.1225V66.4417"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M99.4787 71.9124C107.058 71.9124 113.203 65.7714 113.203 58.1959C113.203 50.6205 107.058 44.4795 99.4787 44.4795C91.8992 44.4795 85.7548 50.6205 85.7548 58.1959C85.7548 65.7714 91.8992 71.9124 99.4787 71.9124Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M131.448 71.9124C139.028 71.9124 145.172 65.7714 145.172 58.1959C145.172 50.6205 139.028 44.4795 131.448 44.4795C123.869 44.4795 117.724 50.6205 117.724 58.1959C117.724 65.7714 123.869 71.9124 131.448 71.9124Z"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M113.123 57.7995H117.883"
                      stroke="black"
                      strokeWidth="4"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M126.53 105.609H126.609V130.425"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M106.777 130.108V106.243"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M99.4787 61.3674C101.231 61.3674 102.652 59.9475 102.652 58.1959C102.652 56.4444 101.231 55.0245 99.4787 55.0245C97.7262 55.0245 96.3055 56.4444 96.3055 58.1959C96.3055 59.9475 97.7262 61.3674 99.4787 61.3674Z"
                      fill="black"
                    />
                    <path
                      d="M131.448 61.3674C133.201 61.3674 134.621 59.9475 134.621 58.1959C134.621 56.4444 133.201 55.0245 131.448 55.0245C129.696 55.0245 128.275 56.4444 128.275 58.1959C128.275 59.9475 129.696 61.3674 131.448 61.3674Z"
                      fill="black"
                    />
                    <path
                      d="M86.7067 63.3495H85.1201C83.3749 63.3495 81.7883 64.0631 80.5984 65.1731C79.4878 66.3624 78.7738 67.9481 78.7738 69.6924C78.7738 73.181 81.6296 76.0353 85.1201 76.0353H88.2933"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M144.22 63.3495H145.807C149.297 63.3495 152.153 66.2038 152.153 69.6924C152.153 71.4367 151.439 73.0224 150.249 74.2117C149.139 75.3217 147.552 76.0353 145.807 76.0353H142.634"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M88.3726 67.7896V71.5953H85.8341C84.8028 71.5953 83.9302 70.7231 83.9302 69.6924C83.9302 69.1374 84.1682 68.6617 84.4855 68.3446C84.8028 68.0274 85.2788 67.7896 85.8341 67.7896H88.3726Z"
                      fill="black"
                    />
                    <path
                      d="M142.634 71.5953V67.7896H145.172C146.204 67.7896 147.076 68.6617 147.076 69.6924C147.076 70.2474 146.838 70.7231 146.521 71.0403C146.204 71.3574 145.728 71.5953 145.172 71.5953H142.634Z"
                      fill="black"
                    />
                    <path
                      d="M115.503 71.2781C115.503 71.2781 111.537 77.621 117.883 76.0353"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M108.364 89.5932C108.364 89.5932 114.71 97.4425 123.436 89.5932"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M93.291 41.9423C93.291 41.9423 97.6541 37.5816 105.19 41.1495"
                      stroke="black"
                      strokeWidth="3"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M137.715 41.9423C137.715 41.9423 133.352 37.5816 125.816 41.1495"
                      stroke="black"
                      strokeWidth="3"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                    />
                    <path
                      d="M88.3726 32.9037C88.3726 32.9037 77.4252 24.4201 82.1849 14.1129C86.9447 3.80572 102.017 9.35574 102.017 9.35574C102.017 9.35574 108.046 35.0444 88.3726 32.9037Z"
                      fill="black"
                    />
                    <path
                      d="M33.9529 96.2539C33.0009 93.1617 31.6523 91.6553 30.9383 87.136C29.4311 78.0974 29.9864 69.4552 26.2579 69.7723C24.7507 69.9309 24.2747 71.5166 24.354 72.3888L25.544 86.6603C25.068 88.3253 24.1954 87.691 24.1954 87.691C24.1954 87.691 21.1015 75.0052 20.7049 72.7059C20.3082 70.4859 19.1976 69.2173 17.6904 69.3759C15.0725 69.6138 16.1038 72.7852 16.3418 73.9745L19.1183 89.356C19.3563 90.8624 17.7697 90.3867 17.7697 90.3867L11.582 75.0052C10.8681 73.3402 9.51949 73.7366 9.51949 73.7366C7.06029 74.2916 8.01224 76.5116 8.01224 76.5116L13.3273 92.8446C13.3273 92.9239 13.3273 93.0031 13.3273 93.0824C13.4066 93.9546 12.296 94.4303 11.82 93.6374C10.1541 91.1003 6.90163 87.0567 4.20444 85.471C2.85585 84.6781 1.9039 84.8367 1.34859 85.2331C0.793288 85.6295 0.713959 86.3431 1.1106 86.8981L11.0267 101.249C13.3273 116.472 22.6088 118.295 22.6088 118.295L28.1618 140.02L36.3327 174.271L37.364 178.632C38.316 182.834 42.1237 185.847 46.4075 185.847H50.7706C53.8645 185.847 56.0063 182.834 55.0544 179.98L35.3014 119.881L34.4288 114.648C36.3327 112.508 37.602 107.988 38.2366 104.737C38.6333 102.993 38.7919 101.17 38.6333 99.4253C38.316 95.0646 41.2511 87.2153 41.2511 87.2153C41.0131 85.7088 38.1573 86.9774 38.1573 86.9774C34.9841 88.0874 34.1908 93.1617 33.9529 95.9367C33.8735 97.126 33.3182 98.1567 32.5249 98.9496C27.7652 103.627 27.3685 108.86 27.3685 108.86"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M20.6256 72.7846C20.2289 70.5646 19.515 68.8996 17.6111 69.4546C15.0725 70.1681 16.0245 72.8638 16.2625 74.0531"
                      stroke="black"
                      strokeWidth="2"
                      strokeMiterlimit="10"
                    />
                    <path
                      d="M175 190.207V191H157.706L154.057 170.782V191H79.1704V179.504C79.1704 176.729 79.1704 173.954 79.2498 171.179C77.5839 172.526 75.7593 173.636 73.6174 174.826L57.0376 185.926C56.9583 186.005 56.879 186.005 56.7996 186.084C56.0857 186.481 55.2924 186.719 54.4198 186.719L50.9719 186.849C50.9719 186.849 54.6578 185.45 55.5304 181.961L49.5807 162.14C58.0689 155.083 71.7928 134.707 98.1301 130.505C99.2407 130.267 100.431 130.029 101.7 129.87C102.89 129.712 104.08 129.553 105.428 129.474L106.301 129.395V129.553L105.825 129.633C105.984 129.633 106.063 129.633 106.222 129.553H106.301C106.46 129.553 106.618 129.553 106.777 129.474H106.856L107.65 129.395V132.408C107.65 132.804 107.808 133.28 108.205 133.676C109.395 135.024 112.092 136.055 115.345 136.293C115.9 136.372 116.455 136.372 117.01 136.372C117.09 136.372 117.169 136.372 117.169 136.372H117.248C120.422 136.293 123.357 135.421 124.864 134.152C125.34 133.756 125.816 133.201 125.816 132.408V129.633L126.609 129.791H126.768C127.006 129.791 127.165 129.87 127.403 129.87V129.633L128.434 129.791C157.548 133.359 175 155.956 175 190.207Z"
                      fill="black"
                    />
                    <path
                      d="M56.9583 185.846L56.7203 186.005C56.7996 186.005 56.879 185.926 56.9583 185.846Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2_0">
                      <rect width="175" height="191" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <div className="d-flex justify-content-between mt-3 parent-add">
                <div className="search-input">
                  <div className="search-patient">
                    <Image src={search} alt="search" className="fa fa-search" />

                    <input
                      type="text"
                      placeholder="Search Student"
                      className="input-patient"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="me-5 d-flex align-items-center filter-class">
                  <strong className="me-2" style={{ fontWeight: 550 }}>
                    Filter by Class
                  </strong>
                  <Select
                    options={unique}
                    placeholder="Select Class"
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="enroll-btn me-4 sm">
                  <Button variant="success" onClick={handleShow}>
                    Enroll New Student
                  </Button>
                </div>

                <div className="me-4">
                  <Link
                    href={"https://rajatdev1.github.io/exam-section/"}
                    target="_blank"
                  >
                    <Button variant="success" style={{ cursor: "pointer" }}>
                      Examination
                    </Button>
                  </Link>
                </div>

                <div className="sm">
                  <Button
                    variant="success"
                    style={{ cursor: "pointer" }}
                    onClick={() => push("/sendmsg")}
                  >
                    Send Message
                  </Button>
                </div>
              </div>

              <StudentTables
                isStudentAdded={isStudentAdded}
                handleDeleteShow={handleDeleteShow}
                isStudentDeleted={isStudentDeleted}
                page={page}
                totalStudent={totalStudent}
                studentData={studentData}
                setPage={setPage}
              />
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
