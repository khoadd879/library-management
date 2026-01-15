import axios from "services/axios.customize";

//fixed
export const loginAPI = (email: string, password: string) => {
  const urlBackend = "/api/Authentication/login";
  return axios.post<ISignIn>(urlBackend, { email, password });
};

//fixed
export const signUpSendOtpAPI = (
  email: string,
  password: string,
  confirmPassword: string
) => {
  const urlBackend = "/api/Authentication/register-send-otp";
  return axios.post<any>(urlBackend, {
    email,
    password,
    confirmPassword,
  });
};

//fixed
export const signUpWithOtpAPI = (email: string, otp: string) => {
  const urlBackend = "/api/Authentication/register-confirm-otp";
  return axios.post<any>(urlBackend, {
    email,
    otp,
  });
};

//fixed
export const authenticateAPI = (token: string | null) => {
  return axios.post<any>("/api/Authentication/authentication", { token });
};

//fixed
export const refreshTokenAPI = (refreshToken: string) => {
  const urlBackend = "/api/Authentication/register-confirm-otp";
  return axios.post<any>(urlBackend, { refreshToken });
};

//fixed
export const forgotPassword = (email: string) => {
  const urlBackend = "/api/ForgotPassword/forgot-password-send-otp";
  return axios.post<any>(urlBackend, { email });
};

//fixed
export const verifyOTP = (email: string, otp: String) => {
  const urlBackend = "/api/ForgotPassword/forgot-password-confirm-otp";
  return axios.post<any>(urlBackend, { email, otp });
};

//fixed
export const changePassword = (
  email: string,
  newPassword: String,
  repeatPassword: String
) => {
  const urlBackend = "/api/ForgotPassword/change-password";
  return axios.post<any>(urlBackend, { email, newPassword, repeatPassword });
};

//author api
export const addAuthorAPI = (formData: FormData) => {
  const urlBackend = "/api/Author/add-author";
  return axios.post<IBackendRes<any>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const listAuthorAPI = () => {
  const urlBackend = "/api/Author/list-author";
  return axios.get<IAuthorResponse>(urlBackend);
};

export const updateAuthorAPI = (idAuthor: string, formData: FormData) => {
  const urlBackend = `/api/Author/update-author?idAuthor=${idAuthor}`;
  return axios.patch<IBackendRes<any>>(urlBackend, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAuthorByID = (idAuthor: string) => {
  const urlBackend = `/api/Author/inf-author?idAuthor=${idAuthor}`;
  return axios.get<IGetAuthorDetail>(urlBackend);
};
//book
export const addBookAPI = (formData: FormData) => {
  return axios.post("/api/Book/add-book", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const getBookAndCommentsByIdAPI = (token: string, idBook: string) => {
  const urlBackend = `/api/Book/books-in-detail-by-id?idbook=${idBook}`;
  return axios.get<IBackendRes<IGetAllBookAndComment[]>>(urlBackend, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};
//book receipt

export const deleteBookReceiptAPI = (idBookReceipt: string) => {
  const urlBackend = `/api/BookReceipt/delete-bookreceipt/${idBookReceipt}`;
  return axios.delete<IBackendRes<any>>(urlBackend);
};
//reader
export const listReaderAPI = (searchKey: string) => {
  const urlBackend = "/api/reader/Reader/list-reader";
  return axios.post<IBackendRes<any>>(urlBackend, { searchKey });
};
export const addReaderAPI = (formData: FormData) => {
  return axios.post<any>("/api/reader/Reader/add-reader", formData);
};

export const updateReaderAPI = (idReader: string, formData: FormData) => {
  return axios.patch<IBackendRes<any>>(
    `/api/reader/Reader/update-reader?idReader=${idReader}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};
export const findReaderAPI = (token: string, username: string) => {
  const urlBackend = "/api/reader/Reader/find-reader";
  return axios.post<IBackendRes<any>>(urlBackend, { token, username });
};
export const getTypeBooksAPI = () => {
  return axios.get("/api/TypeBook/list-all-typebook");
};

export const getTypeBooksWithCountAPI = () => {
  return axios.get("/api/TypeBook/list-typebook-with-count");
};

export const addLoanBookAPI = (idReader: string, idTheBook: string) => {
  const urlBackend = "/api/LoanSlipBook/add-loanbook";
  return axios.post(urlBackend, { idReader, idTheBook });
};
export const getAllReadersAPI = () => {
  return axios.get<IManyReader>("/api/reader/Reader/list-reader");
};
export const addSlipBookAPI = (
  idLoanSlipBook: string,
  idReader: string,
  idTheBook: string
) => {
  const url = "/api/LoanSlipBook/add-slipbook";
  return axios.post<IBackendRes<any>>(url, {
    idLoanSlipBook,
    idReader,
    idTheBook,
  });
};

export const getTypeReadersAPI = () => {
  return axios.get("/api/TypeReader/get-all-typereader");
};
export const getListAuthor = () => {
  return axios.get<IManyAuthor>("/api/Author/list-author");
};
export const getListReader = () => {
  return axios.get<IManyReader>("/api/reader/Reader/list-reader");
};
export const getAllBooksAndCommentsAPI = (idUser: string) => {
  return axios.get<IBookData>(`/api/Book/books-in-detail?idUser=${idUser}`);
};
export const getLoanSlipHistoryAPI = (idUser: string) => {
  const url = `/api/LoanSlipBook/get-loan-slip-book-history?idUser=${idUser}`;
  return axios.get<ILoanHistoryData>(url);
};
export const sendMessageAPI = async (payload: ISendMessagePayload) => {
  const url = "/api/Chat/send";
  return await axios.post(url, payload);
};
export const getChatHistoryAPI = async (receiveUserId: string) => {
  const url = `/api/Chat/history-chat?receiveUserId=${receiveUserId}`;
  const res = await axios.get<IChatMessage[]>(url);
  return res;
};
export const getAllLoanSlipsAPI = async () => {
  const res = await axios.get<ILoanSlipData>(
    "/api/LoanSlipBook/get-all-loan-slip-book"
  );
  return res;
};

export const addFavoriteBookAPI = async (idUser: string, idBook: string) => {
  const url = `/api/Book/like-book`;
  return await axios.post<IBackendRes<any>>(url, { idUser, idBook });
};

export const getFavoriteBooksAPI = async (idUser: string) => {
  const url = `/api/Book/list-liked-book?idReader=${idUser}`;
  return await axios.get<IBookData>(url);
};
export const deleteLoanSlipBookAPI = (idLoanSlipBook: string) => {
  return axios.delete(`/api/LoanSlipBook/delete-loanbook/${idLoanSlipBook}`);
};
export const addPenaltyAPI = (idReader: string, amountCollected: number) => {
  return axios.post("/api/PenaltyTicket/add-penalty", {
    idReader,
    amountCollected,
  });
};
export const deleteAuthorAPI = (idAuthor: string) => {
  return axios.delete(`/api/Author/delete-author/${idAuthor}`);
};
export const deleteReaderAPI = (idReader: string) => {
  return axios.delete(`/api/reader/Reader/delete-reader/${idReader}`);
};
export const deleteBookAPI = (idBook: string) => {
  return axios.delete(`/api/Book/delete-book?idBook=${idBook}`);
};

//evaluation
export const addEvaluationAPI = (
  idUser: string,
  idBook: string,
  eva_Comment: string,
  eva_Star: number
) => {
  return axios.post(`/api/Book/add-evaluation?idUser=${idUser}`, {
    idBook,
    eva_Comment,
    eva_Star,
  });
};

export const getStarByIdBookAPI = async (idBook: string) => {
  const url = `/api/Book/star-by-id?idBook=${idBook}`;
  return await axios.get<IGetStarByIdBook>(url);
};

export const updateBookAPI = (idBook: string, formData: FormData) => {
  return axios.patch<IBackendRes<any>>(
    `/api/Book/update-book?idBook=${idBook}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getAllComments = async (idBook: string) => {
  const url = `/api/Book/all-comments?idBook=${idBook}`;
  return await axios.get<IGetAllComments>(url);
};

export const updateCommentAPI = async (
  idComment: string,
  comment: string,
  rate: number
) => {
  const url = `/api/Book/edit-comment?idComment=${idComment}&comment=${comment}&rate=${rate}`;
  return await axios.put<IBackendRes<any>>(url);
};

export const deleteCommentAPI = (idComment: string, idUser: string) => {
  const url = `/api/Book/delete-comment?idComment=${idComment}&idReader=${idUser}`;
  return axios.delete(url);
};
export const loginGoogleRedirectAPI = () => {
  window.location.href = `https://librarymanagement-api-840378105403.asia-southeast1.run.app/api/Authentication/login-google?returnUrl=%2Fapi%2FAuthentication%2Fprofile`;
};

export const addRoleAPI = (roleName: string, description: string) => {
  const url = "/api/roles/Role/add-role";
  return axios.post(url, {
    roleName,
    description,
  });
};

export const addRolePermissionAPI = (
  roleName: string,
  permissionName: string
) => {
  return axios.post("/api/RolePermission/add-role-permission", {
    roleName: roleName,
    permissionName: permissionName,
  });
};
export const getAllRolesAPI = async () => {
  return axios.get("/api/roles/Role/get-all-role");
};
export const getPermissionsByRoleAPI = async (roleName: string) => {
  return axios.get(`/api/roles/Role/get-all-permisson-by-role`, {
    params: { rolename: roleName },
  });
};
export const deleteRoleAPI = async (roleName: string) => {
  return axios.delete(`/api/roles/Role/delete-role`, {
    data: {
      roleName,
    },
  });
};
export const updateRolePermissionAPI = async (
  oldRoleName: string,
  oldPermissionName: string,
  newRoleName: string,
  newPermissionName: string
) => {
  const res = await axios.patch("/api/RolePermission/update-role-permission", {
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
  return axios.delete("/api/RolePermission/delete-role-permission", {
    data: {
      roleName,
      permissionName,
    },
  });
};
export const addOverdueReportAPI = async (createdDate: string) => {
  const res = await axios.post("/api/OverdueReport/add-overdue-report", {
    createdDate,
  });
  return res;
};
export const updateParameterAPI = async (
  idParameter: string,
  data: { nameParameter: string; valueParameter: number }
) => {
  const res = await axios.put(
    `/api/Parameter/update-parameter?idParameter=${idParameter}`,
    data
  );
  return res;
};
export const getAllParametersAPI = async () => {
  const res = await axios.get("/api/Parameter/get-all-parameter");
  return res;
};
export const getAmountByTypeBookAPI = async (month: number) => {
  const res = await axios.get("/api/LoanSlipBook/get-amount-by-typebook", {
    params: { month },
  });
  return res;
};
export const findBooksByNameAPI = async (namebook: string) => {
  const url = `/api/Book/find-books?namebook=${encodeURIComponent(namebook)}`;
  const res = await axios.get<IBook[]>(url);
  return res;
};
export const getAllHeaderBooksAPI = async () => {
  const res = await axios.get<IHeaderBook[]>("/api/Book/list-headerbook");
  return res;
};
export const getChatUsersAPI = async () => {
  const res = await axios.get("/api/Chat/get-all-reader-sent-message");
  return res;
};
export const logoutAPI = async (refreshToken: string) => {
  return axios.post("/api/Authentication/logout", { token: refreshToken });
};
export const getReaderByIdAPI = async (idreader: string) => {
  const url = `/api/reader/Reader/get-reader-by-id?idReader=${idreader}`;
  const res = await axios.get(url);
  return res;
};
export const getPenaltiesByIdAPI = (idUser: string) => {
  return axios.get<IPenaltyData>(
    `/api/PenaltyTicket/list-penalty-ticket-by-user?idUser=${idUser}`
  );
};
export const getReceiptHistoryAPI = (idReader: string) => {
  return axios.get<IReturnData>(
    `/api/LoanSlipBook/get-receipt-history?idReader=${idReader}`
  );
};
export const getBookStatusAPI = async (idThebook: string) => {
  const res = await axios.get("/api/Book/the-book-status", {
    params: {
      idThebook,
    },
  });
  return res;
};
export const getHeaderBookByTheBookIdAPI = async (thebookId: string) => {
  const res = await axios.get(
    `/api/Book/headerbook-by-thebook-id?idTheBook=${thebookId}`
  );
  return res;
};
export const addBookReceiptAPI = (formData: FormData) => {
  return axios.post("/api/BookReceipt/add-bookreceipt", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const addTypeBookAPI = (nameTypeBook: string) => {
  return axios.post("/api/TypeBook/add-typebook", {
    nameTypeBook,
  });
};
export const addTypeReaderAPI = (nameTypeReader: string) => {
  return axios.post("/api/TypeReader/add-typereader", {
    nameTypeReader,
  });
};
export const updateTypeBookAPI = (idTypeBook: string, nameTypeBook: string) => {
  return axios.put(`/api/TypeBook/update-typebook/${idTypeBook}`, {
    nameTypeBook,
  });
};
export const updateTypeReaderAPI = (
  idTypeReader: string,
  nameTypeReader: string
) => {
  return axios.put(`/api/TypeReader/update-typereader/${idTypeReader}`, {
    nameTypeReader,
  });
};
export const deleteTypeBookAPI = (idTypeBook: string) => {
  return axios.delete(`/api/TypeBook/delete-typebook/${idTypeBook}`);
};
export const deleteTypeReaderAPI = (idTypeReader: string) => {
  return axios.delete(`/api/TypeReader/delete-typereader/${idTypeReader}`);
};
export const createAIMessageAPI = (idReader: string, readerMessage: string) => {
  const url = "/api/Ai/generate-message";
  return axios.post<any>(url, { idReader, readerMessage });
};

// 2. GET /api/Ai/get-history
export const getAIHistoryAPI = (idReader: string) => {
  const url = `/api/Ai/get-history?idReader=${idReader}`;
  return axios.get<any>(url);
};

// 3. DELETE /api/Ai/delete-history
export const deleteAIHistoryAPI = (idReader: string) => {
  const url = `/api/Ai/delete-history?idReader=${idReader}`;
  return axios.delete<any>(url);
};
