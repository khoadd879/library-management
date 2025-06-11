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
export const updateAuthorAPI = (idAuthor: string, data: IAddAuthor) => {
  const urlBackend = `/api/Author/update_author/${idAuthor}`;
  return axios.put<IBackendRes<IAddAuthor>>(urlBackend, data);
};
export const deleteAuthorAPI = (idAuthor: string) => {
  const urlBackend = `/api/Author/delete_author/${idAuthor}`;
  return axios.delete<IBackendRes<IAddAuthor>>(urlBackend);
};

export const getAuthorByID = (token: string, idAuthor: string) => {
  const urlBackend = `/api/Author/getauthorbyid${idAuthor}`;
  return axios.get<IAddAuthor>(urlBackend, {
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

export const deleteBookAPI = (idBook: string, idTheBook: string) => {
  const urlBackend = `/api/Book/delete_book/${idBook}/${idTheBook}`;
  return axios.delete<IBackendRes<any>>(urlBackend);
};
export const updateBookAPI = (
  idBook: string,
  idTheBook: string,
  data: IUpdateBookPayload
) => {
  const urlBackend = `/api/Book/update_book/${idBook}/${idTheBook}`;
  return axios.put<IBackendRes<any>>(urlBackend, data);
};

export const getAllBooksAndCommentsAPI = (token: string) => {
  const urlBackend = "/api/Book/getbooksindetail";
  return axios.get<IBackendRes<IGetAllBookAndComment>>(urlBackend, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
  return axios.post<IBackendRes<any>>(
    "/api/reader/Reader/add_reader",
    formData
  );
};

export const updateReaderAPI = (
  idReader: string,
  data: IUpdateReaderPayload
) => {
  const urlBackend = `/api/reader/Reader/update_reader/${idReader}`;
  return axios.put<IBackendRes<any>>(urlBackend, data);
};
export const deleteReaderAPI = (idReader: string) => {
  const urlBackend = `/api/reader/Reader/delete_reader/${idReader}`;
  return axios.delete<IBackendRes<any>>(urlBackend);
};
export const findReaderAPI = (token: string, username: string) => {
  const urlBackend = "/api/reader/Reader/find_reader";
  return axios.post<IBackendRes<any>>(urlBackend, { token, username });
};
export const getTypeBooksAPI = () => {
  return axios.get("/api/TypeBook/getTypeBook");
};
export const getListAuthor = () => {
  return axios.get("/api/Author/list_author");
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
export const getLoanSlipHistoryAPI = (idUser: string) => {
  const url = `/api/LoanSlipBook/getloansliphistory?idUser=${idUser}`;
  return axios.get<IBackendRes<any>>(url);
};
export const getTypeReadersAPI = () => {
  return axios.get("/api/TypeReader/getAllTypeReader");
};
