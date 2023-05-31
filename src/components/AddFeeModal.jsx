import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-hot-toast";
import config from "@/utils/config";
import { Spinner } from "react-bootstrap";
import { BsCalendarDate } from "react-icons/bs";
import DatePicker from "react-datepicker";

const schema = yup.object({
  paid_amount: yup.string(),
  paid_month: yup.string(),
  deposited_date: yup.string(),
  tuition_fee: yup.string(),
  transport_fee: yup.string(),
  examination_fee: yup.string(),
});

const Index = ({
  handleClose,
  show,
  setShow,
  isFeeAdded,
  setisFeeAdded,
  studentId,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);

    reset();

    let total =
      Number(data?.tuition_fee) +
      Number(data?.transport_fee) +
      Number(data?.examination_fee);

    let per = (Number(data.paid_amount) / total) * 100;

    data.due = total - Number(data.paid_amount);
    data.payment_status = String(Math.floor(per)) + "%";

    axios
      .post(`${config.baseUrl}/api/postfee?studentId=${studentId}`, data)
      .then((res) => {
        reset();
        setShow(false);
        toast.success("Added Fee !");
        setisFeeAdded(!isFeeAdded);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="loader">
          <Spinner animation="border" role="status"></Spinner>
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Fee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Tuition Fee"
                {...register("tuition_fee")}
              />
              <p style={{ color: "red" }}>{errors.tuition_fee?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Transport Fee"
                {...register("transport_fee")}
              />
              <p style={{ color: "red" }}>{errors.transport_fee?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Examination Fee"
                {...register("examination_fee")}
              />
              <p style={{ color: "red" }}>{errors.examination_fee?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Amount Paid"
                {...register("paid_amount")}
              />
              <p style={{ color: "red" }}>{errors.paid_amount?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Enter Paid Month"
                {...register("paid_month")}
              />
              <p style={{ color: "red" }}>{errors.paid_month?.message}</p>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                type="text"
                placeholder="Enter Deposited Date"
                {...register("deposited_date")}
              />
              <p style={{ color: "red" }}>{errors.deposited_date?.message}</p>
            </Form.Group>

            <div className="mx-auto d-flex justify-content-center align-items-center">
              <Button variant="success" type="submit" className="mx-auto px-5">
                Submit
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Index;
