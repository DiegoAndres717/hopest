'use client'

import FormInputs from '../inputs/FormInputs';
import React from 'react'

    const RegisterForm = ({ handleSubmit, data, setData, setConfirmPassword }) => {
        return (
          <>
          <form onSubmit={handleSubmit}>
            <FormInputs data={data} setData={setData} setConfirmPassword={setConfirmPassword} />
          </form>
          </>
        );
      };


export default RegisterForm