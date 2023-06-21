"use client";

import React, { useCallback, useState } from "react";
import axios from 'axios'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterForm from "../components/forms/RegisterForm";

const Register = () => {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password !== confirmPassword) {
      return toast.error('Las contraseñas no coinciden');
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/register`, data);
      toast.success('Usuario registrado con éxito!');
      window.location.replace('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data);
      } else {
        toast.error('Algo salió mal!');
      }
    }
  };

  return (
    <div className="flex max-w-sm border border-solid rounded-lg items-center justify-center bg-white p-12">
    <RegisterForm
      handleSubmit={handleSubmit}
      data={data}
      setData={setData}
      setConfirmPassword={setConfirmPassword}
    />
    <ToastContainer />
  </div>
  );
};

export default Register;
