import { useEffect, useState, useRef } from "react";
import "../assets/scss/dashboard.scss";
import "../assets/scss/modal.scss";
import Modal from "../components/Modal";
import { selectIsLoggedIn } from "../store/modules/authSlice";
import AppServices from "../services";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  addUser,
  removeUser,
  selectUsers,
  setUsers,
  updateUser,
} from "../store/modules/userSlice";

function Users() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const users = useSelector(selectUsers);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({});
  const [hasCalledApi, setHasCalledApi] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      AppServices.getUsers().then((response) => {
        if (response.data.data) {
          console.log("Data from the database", response.data.data);
          dispatch(setUsers(response.data.data));
        }
      });
    }
  }, [isLoggedIn, hasCalledApi]);

  console.log("Users", users);

  const childRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isToUpdate, setIsToUpdate] = useState(false);
  const [isToCreate, setIsToCreate] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState("");

  const [selectedUser, setselectedUser] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleModal = () => {
    console.log("Name", name);
    console.log("Email", email);

    if (childRef.current) childRef.current.toggleModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isUpdating = selectedUserId !== "";

    toast.promise(
      isDeleting
        ? AppServices.deleteUser(selectedUserId)
        : isUpdating
        ? AppServices.updateUser(
            {
              name: name || selectedUser?.name,
              email: email || selectedUser?.email,
            },
            selectedUserId
          )
        : AppServices.register({ name, email, password }),
      {
        loading: `${
          isDeleting ? "Deleting" : isUpdating ? "Updating" : "Creating"
        } user ...`,
        success: (response) => {
          if (isDeleting) dispatch(removeUser(selectedUserId));
          else if (isUpdating)
            dispatch(
              updateUser({
                ...response.data.data,
                ...selectedUser,
              })
            );
          else dispatch(addUser(response.data.data));

          let message = `${
            isDeleting ? "Deleted" : isUpdating ? "Updated" : "Created"
          } user successfully`;

          if (isUpdating) setSelectedUserId("");
          if (isDeleting) setIsDeleting(false);
          setHasCalledApi(!hasCalledApi);
          setIsToCreate(false);
          setIsToUpdate(false);
          setIsDeleting(false);
          setselectedUser({});
          toggleModal();
          return message;
        },
        error: (error) => {
          let message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          return message;
        },
      }
    );
  };

  return (
    <div className="pt-10 pl-10">
      <div>
        <div className="title">User management system</div>
        <div className="md:flex">
          <div className="w-full">
            <div className="md:flex">
              <div>
                <button
                  onClick={() => {
                    setIsToCreate(true);
                    toggleModal();
                  }}
                  className="flex w-auto requestRegNum"
                >
                  <div>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14 14.252V22H4C3.99969 20.7789 4.27892 19.5739 4.8163 18.4774C5.35368 17.3809 6.13494 16.4219 7.10022 15.674C8.0655 14.9261 9.18918 14.4091 10.3852 14.1626C11.5811 13.9162 12.8177 13.9467 14 14.252ZM12 13C8.685 13 6 10.315 6 7C6 3.685 8.685 1 12 1C15.315 1 18 3.685 18 7C18 10.315 15.315 13 12 13ZM18 17V14H20V17H23V19H20V22H18V19H15V17H18Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className="mt-1">Create a new user</div>
                </button>
              </div>
              <div className="flex ml-auto mr-6">
                <div className="mt-2 ml-4">
                  <input
                    onChange={(e) => {
                      setFilter({ ...filter, search: e.target.value });
                    }}
                    type="text"
                    name=""
                    id=""
                    placeholder="search"
                    className="px-3 py-1 input"
                  />
                </div>
              </div>
            </div>
            <div className="table w-full">
              <table>
                <thead>
                  <tr className="flex-col table-row mb-2 rounded-none rounded-l-lg flex-no wrap">
                    <th>User Names</th>
                    <th>Email</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="sm:flex-none">
                  {users?.map((doc) => (
                    <tr
                      key={doc._id}
                      className="sm:flex-col sm:flex-no sm:wrap sm:table-row sm:mb-0 main-header sm:header tr"
                    >
                      <td className="p-3">
                        <div className="flex items-center">
                          <div></div>
                          <div>{doc?.name}</div>
                        </div>
                      </td>
                      <td className="p-3">
                        {" "}
                        <div className="">{doc?.email}</div>
                      </td>
                      <td className="p-3">
                        {((date) => {
                          return `${date.getDate()}/${
                            date.getMonth() + 1
                          }/${date.getFullYear()}`;
                        })(new Date(doc?.createdAt))}
                      </td>
                      <td className="p-3">
                        <div className="flex">
                          <div
                            onClick={() => {
                              setselectedUser({
                                name: doc.name,
                                email: doc.email,
                                password: doc.password,
                              });
                              setSelectedUserId(doc._id);
                              console.log("isToCreate", isToCreate);
                              setIsToUpdate(true);
                              toggleModal();
                            }}
                            className="mr-2 rounded cursor-pointer status"
                          >
                            Update
                          </div>
                          <div
                            onClick={() => {
                              setIsDeleting(true);
                              setSelectedUserId(doc._id);
                              toggleModal();
                            }}
                            className="rounded cursor-pointer status"
                          >
                            Delete
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <Modal ref={childRef} width="767px">
        {isDeleting && (
          <div>
            <div className="my-10 text-center modal-title">
              Are you sure you want to delete the selected user ?
            </div>
            <div className="my-10 modal-footer">
              <div className="flex justify-center">
                <button
                  className="cancel mr-9"
                  onClick={() => {
                    setIsToCreate(false);
                    setIsToUpdate(false);
                    setIsDeleting(false);
                    toggleModal();
                  }}
                >
                  No
                </button>
                <button onClick={handleSubmit}>Yes</button>
              </div>
            </div>
          </div>
        )}

        {isToUpdate && (
          <div>
            <div className="my-10 text-center modal-title">{"Update user"}</div>
            <div className="modal-body">
              <form>
                <div className="">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          defaultValue={selectedUser?.name}
                          onChange={(e) => setName(e.target.value)}
                          type="text"
                          id="name"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
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
                          defaultValue={selectedUser?.email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                          type="text"
                          id="email"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="my-10 modal-footer">
              <div className="flex justify-center">
                <button
                  className="cancel mr-9"
                  onClick={() => {
                    setIsToCreate(false);
                    setIsToUpdate(false);
                    setIsDeleting(false);
                    toggleModal();
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}

        {isToCreate && (
          <div>
            <div className="my-10 text-center modal-title">{"Create user"}</div>
            <div className="modal-body">
              <form>
                <div className="">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Name
                        </label>
                        <input
                          onChange={(e) => {
                            setName(e.target.value);
                          }}
                          type="text"
                          id="name"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
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
                            setEmail(e.target.value);
                          }}
                          type="text"
                          id="email"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
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
                            setPassword(e.target.value);
                          }}
                          type="password"
                          id="password"
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="my-10 modal-footer">
              <div className="flex justify-center">
                <button
                  className="cancel mr-9"
                  onClick={() => {
                    setIsToCreate(false);
                    setIsToUpdate(false);
                    setIsDeleting(false);
                    toggleModal();
                  }}
                >
                  Cancel
                </button>
                <button onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Users;
