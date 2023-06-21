'use client'

const FormInputs = ({data, setData, setConfirmPassword}) => {
  return (
    <>
      <div className="mt-8 space-y-8">
        <div className="space-y-6">
          <input
            id="name"
            name="name"
            type="text"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
            placeholder="escribe tu nombre"
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
            placeholder="escribe un email"
          />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
            className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
            placeholder="ingresa un contraseña"
          />
          <input
            id="confirmPasswordpassword"
            name="confirmPassword"
            type="password"
            autoComplete="current-password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent text-gray-600 dark:text-white rounded-md border border-gray-300 px-3 py-2 text-sm placeholder-gray-600 invalid:border-red-500 "
            placeholder="comfirmar contraseña"
          />
        </div>
        <button
          type="submit"
          className={
            "h-9 px-3 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:bg-blue-700 transition duration-500 rounded-md text-white"
          }
        >
          Register
        </button>
      </div>
    </>
  );
};

export default FormInputs;
