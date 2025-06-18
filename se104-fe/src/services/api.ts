import axios from "services/axios.customize";

export const loginAPI = (username: string, password: string) => {
  const urlBackend = "/api/Authentication/SignIn";
  return axios.post<ISignIn>(urlBackend, { username, password });
};
export const signUpSendOtpAPI = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const urlBackend = "/api/Authentication/SignUpSendOtp";
  return axios.post<any>(urlBackend, {
    email,
    password,
    confirmPassword,
  });
};
export const signUpWithOtpAPI = (email: string, otp: string) => {
  const urlBackend = "/api/Authentication/SignUpWithReceivedOtp";
  return axios.post<any>(urlBackend, {
    email,
    otp,
  });
};

export const authenticateAPI = (token: string | null) => {
  return axios.post(
    "/api/Authentication/Authentication",
    JSON.stringify(token),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const refreshTokenAPI = (refreshToken: string) => {
  const urlBackend = "/api/Authentication/RefreshToken";
  return axios.post<any>(urlBackend, { refreshToken });
};

export const forgotPassword = (email: string) => {
  const urlBackend = "/api/ForgotPassword/send_otp";
  return axios.post<any>(urlBackend, { email });
};

export const verifyOTP = (email: string, otp: String) => {
  const urlBackend = "/api/ForgotPassword/verify_otp";
  return axios.post<any>(urlBackend, { email, otp });
};
export const changePassword = (
  email: string,
  newPassword: String,
  repeatPassword: String
) => {
  const urlBackend = "/api/ForgotPassword/change_password";
  return axios.post<any>(urlBackend, { email, newPassword, repeatPassword });
};
//author api
export const addAuthorAPI = (formData: FormData) => {
  const urlBackend = "/api/Author/add_author";
  return axios.post<IBackendRes<any>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listAuthorAPI = (token: string) => {
  const urlBackend = "/api/Author/list_author";
  return axios.get<IBackendRes<IAddAuthor>>(urlBackend, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const updateAuthorAPI = (idAuthor: string, formData: FormData) => {
  const urlBackend = `/api/Author/update_author/${idAuthor}`;
  return axios.patch<IBackendRes<any>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAuthorByID = (token: string, idAuthor: string) => {
  const urlBackend = `/api/Author/getauthorbyid${idAuthor}`;
  return axios.get<IGetAuthor>(urlBackend, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
//book
export const addBookAPI = (formData: FormData) => {
  return axios.post("/api/Book/add_book", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getBookAndCommentsByIdAPI = (token: string, idBook: string) => {
  const urlBackend = `/api/Book/getbooksindetailbyid${idBook}`;
  return axios.get<IBackendRes<IGetAllBookAndComment>>(urlBackend, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
//book receipt
export const addBookReceiptAPI = (data: IAddBookReceiptPayload) => {
  const urlBackend = "/api/BookReceipt/add_bookreceipt";
  return axios.post<IBackendRes<any>>(urlBackend, data);
};
export const deleteBookReceiptAPI = (idBookReceipt: string) => {
  const urlBackend = `/api/BookReceipt/delete_bookreceipt/${idBookReceipt}`;
  return axios.delete<IBackendRes<any>>(urlBackend);
};
//reader
export const listReaderAPI = (searchKey: string) => {
  const urlBackend = "/api/reader/Reader/list_reader";
  return axios.post<IBackendRes<any>>(urlBackend, { searchKey });
};
export const addReaderAPI = (formData: FormData) => {
  return axios.post<any>("/api/reader/Reader/add_reader", formData);
};

export const updateReaderAPI = (idReader: string, formData: FormData) => {
  return axios.patch<IBackendRes<any>>(
    `/api/reader/Reader/update_reader/${idReader}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const findReaderAPI = (token: string, username: string) => {
  const urlBackend = "/api/reader/Reader/find_reader";
  return axios.post<IBackendRes<any>>(urlBackend, { token, username });
};
export const getTypeBooksAPI = () => {
  return axios.get("/api/TypeBook/getAllTypeBook");
};

export const addLoanBookAPI = (idReader: string, idTheBook: string) => {
  const urlBackend = "/api/LoanSlipBook/add_loanbook";
  return axios.post(urlBackend, { idReader, idTheBook });
};
export const getAllReadersAPI = () => {
  return axios.get<{ idReader: string; nameReader: string }[]>(
    "/api/reader/Reader/list_reader"
  );
};
export const addSlipBookAPI = (
  idLoanSlipBook: string,
  idReader: string,
  idTheBook: string
) => {
  const url = "/api/LoanSlipBook/add_slipbook";
  return axios.post<IBackendRes<any>>(url, {
    idLoanSlipBook,
    idReader,
    idTheBook,
  });
};

export const getTypeReadersAPI = () => {
  return axios.get("/api/TypeReader/getAllTypeReader");
};
export const getListAuthor = () => {
  return axios.get<IAddAuthor[]>("/api/Author/list_author");
};
export const getListReader = () => {
  return axios.get<IReader[]>("/api/reader/Reader/list_reader");
};
export const getAllBooksAndCommentsAPI = () => {
  return axios.get<IBook[]>("/api/Book/getbooksindetail");
};
export const getLoanSlipHistoryAPI = (idUser: string) => {
  const url = `/api/LoanSlipBook/getloansliphistory?idUser=${idUser}`;
  return axios.get<ILoanHistory[]>(url);
};
export const sendMessageAPI = async (payload: ISendMessagePayload) => {
  const url = "/api/Chat/send";
  return await axios.post(url, payload);
};
export const getChatHistoryAPI = async (receiveUserId: string) => {
  const url = `/api/Chat/history?receiveUserId=${receiveUserId}`;
  const res = await axios.get<IChatMessage[]>(url);
  return res;
};
export const getAllLoanSlipsAPI = async () => {
  const res = await axios.get<ILoanSlip[]>(
    "/api/LoanSlipBook/getAllBookLoanSlip"
  );
  return res;
};

export const addFavoriteBookAPI = async (idBook: string) => {
  const url = `/api/Book/LikeBook?idBook=${idBook}`;
  return await axios.post<IBackendRes<any>>(url);
};

export const getFavoriteBooksAPI = async () => {
  const url = "/api/Book/getlikedbook";
  return await axios.get<IBook[]>(url);
};
export const deleteLoanSlipBookAPI = (idLoanSlipBook: string) => {
  return axios.delete(`/api/LoanSlipBook/delete_loanbook/${idLoanSlipBook}`);
};
export const addPenaltyAPI = (idReader: string, amountCollected: number) => {
  return axios.post("/api/PenaltyTicket/add_penalty", {
    idReader,
    amountCollected,
  });
};
export const deleteAuthorAPI = (idAuthor: string) => {
  return axios.delete(`/api/Author/delete_author/${idAuthor}`);
};
export const deleteReaderAPI = (idReader: string) => {
  return axios.delete(`/api/reader/Reader/delete_reader/${idReader}`);
};
export const deleteBookAPI = (idBook: string) => {
  return axios.delete(`/api/Book/delete_book/${idBook}`);
};

//evaluation
export const addEvaluationAPI = (
  idBook: string,
  eva_Comment: string,
  eva_Star: number
) => {
  return axios.post("/api/Book/addEvaluation", {
    idBook,
    eva_Comment,
    eva_Star,
  });
};

export const getStarByIdBookAPI = async (idBook: string) => {
  const url = `/api/Book/getStarById${idBook}`;
  return await axios.get<IGetStarByIdBook[]>(url);
};
export const updateBookAPI = (idBook: string, formData: FormData) => {
  return axios.patch<IBackendRes<any>>(
    `/api/Book/update_book/${idBook}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getAllComments = async (idBook: string) => {
  const url = `/api/Book/getAllComments${idBook}`;
  return await axios.get<IGetAllComments[]>(url);
};

export const updateCommentAPI = async (
  idComment: string,
  comment: string,
  rate: number
) => {
  const url = `/api/Book/editComment${idComment}?comment=${comment}&rate=${rate}`;
  return await axios.put<IBackendRes<any>>(url);
};

export const deleteCommentAPI = (idComment: string) => {
  // Đúng chuẩn API: truyền idComment qua query string
  const url = `/api/Book/deleteComment?idComment=${encodeURIComponent(
    idComment
  )}`;
  return axios.delete(url);
};
export const loginGoogleRedirectAPI = () => {
  window.location.href = `https://librarymanagement-api-840378105403.asia-southeast1.run.app/api/Authentication/login-google?returnUrl=%2Fapi%2FAuthentication%2Fprofile`;
};

export const addRoleAPI = (roleName: string, description: string) => {
  const url = "/api/roles/Role/add_role";
  return axios.post(url, {
    roleName,
    description,
  });
};

export const addRolePermissionAPI = (
  roleName: string,
  permissionName: string
) => {
  return axios.post("/api/RolePermission/add_role_permission", {
    roleName,
    permissionName,
  });
};
export const getAllRolesAPI = async () => {
  return axios.get("/api/roles/Role/getAllRoles");
};
export const getPermissionsByRoleAPI = async (roleName: string) => {
  return axios.get(`/api/roles/Role/getAllPermissonByRole`, {
    params: { rolename: roleName },
  });
};
export const deleteRoleAPI = async (roleName: string) => {
  return axios.delete(
    `/api/roles/Role/delete_role/${encodeURIComponent(roleName)}`
  );
};
export const updateRolePermissionAPI = async (
  oldRoleName: string,
  oldPermissionName: string,
  newRoleName: string,
  newPermissionName: string
) => {
  const res = await axios.patch("/api/RolePermission/update_role_permission", {
    oldRoleName,
    oldPermissionName,
    newRoleName,
    newPermissionName,
  });

  return res;
};
export const deleteRolePermissionAPI = async (
  roleName: string,
  permissionName: string
) => {
  return axios.delete("/api/RolePermission/delete_role_permission", {
    data: {
      roleName,
      permissionName,
    },
  });
};
export const addOverdueReportAPI = async (createdDate: string) => {
  const res = await axios.post("/api/OverdueReport/add_overdue_report", {
    createdDate,
  });
  return res;
};
export const updateParameterAPI = async (
  idParameter: string,
  data: { nameParameter: string; valueParameter: number }
) => {
  const res = await axios.put(
    `/api/Parameter/update_parameter/${idParameter}`,
    data
  );
  return res;
};
export const getAllParametersAPI = async () => {
  const res = await axios.get("/api/Parameter/getallparameter");
  return res;
};
export const getAmountByTypeBookAPI = async (month: number) => {
  const res = await axios.get("/api/LoanSlipBook/getAmountByTypeBook", {
    params: { month },
  });
  return res;
};
export const findBooksByNameAPI = async (namebook: string) => {
  const url = `/api/Book/findBooks${encodeURIComponent(namebook)}`;
  const res = await axios.get<IBook[]>(url);
  return res;
};
export const getAllHeaderBooksAPI = async () => {
  const res = await axios.get<IHeaderBook[]>("/api/Book/getallheaderbooks");
  return res;
};
export const getChatUsersAPI = async () => {
  const res = await axios.get("/api/Chat/getAllUserSentMessage");
  return res;
};
export const logoutAPI = async (refreshToken: string) => {
  return axios.post("/api/Authentication/logout", { refreshToken });
};
