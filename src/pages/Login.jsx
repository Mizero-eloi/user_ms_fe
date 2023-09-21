import { useEffect, useState, useRef } from "react";

import logo from "../assets/images/logo.svg";
import LoginSVG from "../assets/images/login.svg";
import "../assets/scss/login.scss";
import toast from "react-hot-toast";
import AppServices from "../services";
import Modal from "../components/Modal";

import { loadUser, selectIsLoggedIn } from "../store/modules/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function Login() {
  const [email, SetEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [password, SetPassword] = useState("");
  const [admin, setAdmin] = useState({});
  const dispatch = useDispatch();

  const childRef = useRef(null);

  const toggleModal = () => {
    if (childRef.current) childRef.current.toggleModal();
  };
  dispatch(loadUser());
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    } else {
      dispatch(loadUser());
    }
  }, [isLoggedIn]);

  const onChangeEmail = (e) => {
    SetEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    SetPassword(e.target.value);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (submitted) return;
    setSubmitted(true);

    toast.promise(AppServices.login({ email, password }), {
      loading: "Logging in ...",
      success: (response) => {
        if (response.data.data.access_token) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.data.access_token)
          );
          dispatch(loadUser());
        }
        navigate("/");
        setSubmitted(false);
        return "Logged in successfully";
      },
      error: (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setSubmitted(false);
        return message;
      },
    });
  };
  const handleRegister = (e) => {
    e.preventDefault();

    if (submitted) return;
    setSubmitted(true);

    toast.promise(AppServices.register(admin), {
      loading: "Registering ...",
      success: () => {
        toggleModal();
        setSubmitted(false);
        return "Registered successfully";
      },
      error: (error) => {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setSubmitted(false);
        console.log("Errorrrrr", error);

        return message;
      },
    });
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="flex items-center justify-around w-screen">
        <div className="flex-col items-center justify-center hidden w-full gap-5 md:flex h-max">
          <h3 className="text-xl font-medium">
            Almost there, <br /> Enter your credentials to have access.
          </h3>
          <img src={LoginSVG} alt="login illustration" />
        </div>
        <div className="flex items-center justify-center w-full h-screen m-auto bg-primary">
          <form
            className="w-full h-auto py-3 text-center md:p-8 lg:w-2/3 md:w-4/5 form bg-main"
            onSubmit={handleLogin}
          >
            <img src={logo} className="h-32 mx-auto mb-3" alt="" />
            <div className="mb-10 title">
              Welcome again!
              <br />
              <div className="small"> Binary Supermarket</div>
            </div>
            <div className="mb-8 input-container">
              <input
                onChange={onChangeEmail}
                className="bg focus:outline-none"
                placeholder="Email"
                type="text"
                name=""
                id=""
              />
            </div>
            <div className="mb-8 input-container">
              <input
                onChange={onChangePassword}
                className="bg focus:outline-none"
                placeholder="Password"
                type="password"
                name=""
                id=""
              />
            </div>
            <div className="mb-8 input-container">
              <input
                className="cursor-pointer submit bg-primary text-main"
                type="submit"
                value="Login"
              />
            </div>
            <div
              onClick={toggleModal}
              className="mb-8 cursor-pointer input-container text-primary"
            >
              Don't have an account? Signup
            </div>
          </form>
        </div>
      </div>

      <Modal
        ref={childRef}
        width="767px"
        children={
          <div>
            <div className="my-10 text-center modal-title">Signup</div>
            <div className="modal-body">
              <form>
                <div className="">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Names`
                        </label>
                        <input
                          onChange={(e) => {
                            setAdmin({ ...admin, name: e.target.value || "" });
                          }}
                          type="text"
                          id="first-name"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          onChange={(e) => {
                            setAdmin({ ...admin, email: e.target.value || "" });
                          }}
                          type="email"
                          id="email"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Password
                        </label>
                        <input
                          onChange={(e) => {
                            setAdmin({
                              ...admin,
                              password: e.target.value || "",
                            });
                          }}
                          type="password"
                          id="password"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <button type="submit" hidden></button>
                  </div>
                </div>
              </form>
            </div>
            <div className="my-10 modal-footer">
              <div className="flex justify-center">
                <button className="cancel mr-9" onClick={toggleModal}>
                  Cancel
                </button>
                <button onClick={handleRegister}>Submit</button>
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}

export default Login;
