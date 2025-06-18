export {};

declare global {
  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    results: T[];
  }

  interface IUser {
    email: string;
    phone: string;
    fullName: string;
    role: string;
    avatar: string;
    id: string;
  }
  export interface IFetchUser {
    idReader: string;
    idTypeReader: string;
    nameReader: string | null;
    sex: string | null;
    address: string | null;
    email: string | null;
    dob: string;
    createDate: string;
    expiryDate: string;
    readerUsername: string;
    typeReader: any;
    roleName: string;
    avatarUrl: string;
  }

  interface ISignIn {
    token: string;
    refreshToken: string;
    iduser: string;
  }

  export interface IGetAuthor {
    idAuthor: string;
    nameAuthor: string;
    biography: string;
    nationality: string;
    urlAvatar: string | null;
    idTypeBook: {
      idTypeBook: string;
      nameTypeBook: string;
    };
    books: IBookAuthor[];
  }

  export interface IBookAuthor {
    idBook: string;
    nameBook: string;
    publisher: string;
    reprintYear: number;
    valueOfBook: number;
    urlImage: string;
  }

  interface IAddBookForm {
    idTypeBook: string;
    nameHeaderBook: string;
    describeBook: string;
    idAuthors: string[];
    bookImage: File;
    publisher: string;
    reprintYear: number;
    valueOfBook: number;
  }

  export interface IDetailRequest {
    quantity: number;
  }

  export interface IGetAllBookAndComment {
    idBook: string;
    nameBook: string;
    describe: string;
    image: string;
    isLiked: boolean;
    evaluations: any[];
    reprintYear: number;
    authors: {
      idAuthor: string;
      idTypeBook: {
        idTypeBook: string;
        nameTypeBook: string;
      };
      nameAuthor: string;
      nationality: string;
      biography: string;
      urlAvatar: string;
    }[];
  }

  export interface IHeaderBook {
    idHeaderBook: string;
    idTypeBook: string;
    nameBook: string;
    describe: string;
  }

  export interface IAddBookReceiptPayload {
    headerBook: IHeaderBook;
    idReader: string;
    listDetailRequest: IDetailRequest[];
  }
  export interface ITheBookUpdateRequest {
    status: string;
  }

  export interface IUpdateBookPayload {
    idTypeBook: string;
    nameSideBook: string;
    describeBook: string;
    idAuthors: string[];
    bookReceiptRequest: IBookReceiptRequest;
    theBookUpdateRequest: ITheBookUpdateRequest;
  }
  export interface IAddReaderPayload {
    idTypeReader: string;
    nameReader: string;
    sex: string;
    address: string;
    email: string;
    dob: string; // cái này dùng datepicker xong r dùng hàm .toISOString()
    phone: string;
    readerPassword: string;
    totalDebt: number;
    AvatarImage: File;
  }

  export interface IUserProfile {
    username?: string;
    fullName?: string;
    gender?: string;
    createdAt?: string | Date;
    cardExpiryDate?: string | Date;
    address?: string;
    email?: string;
    phone?: string;
    avatar?: string | null;
  }

  export interface IUser {
    id: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    gender: string;
    password: string;
    joinDate: string;
    expireDate?: string;
    permissions: {
      receiveBooks: boolean;
      manageUsers: boolean;
      borrowBooks: boolean;
      viewLists: boolean;
      viewReports: boolean;
    };
    avatar?: string | null;
    dob?: string;
  }
  export interface IAddAuthor {
    idAuthor: string;
    idTypeBook: ITypeBook;
    nameAuthor: string;
    nationality: string;
    biography: string;
    urlAvatar: string | null;
  }
  export interface IReader {
    idReader: string;
    nameReader: string;
    address: string;
    email: string;
    phone: string;
    createDate: string;
    readerAccount: string;
    dob: string;
    sex: string;
    totalDebt: number;
    urlAvatar: string | null;
    ReaderPassword: string;
    idTypeReader: {
      idTypeReader: string;
      nameTypeReader: string;
    };
    role: string;
  }
  export interface ITypeBook {
    idTypeBook: string;
    nameTypeBook: string;
  }

  export interface IAuthor {
    idAuthor: string;
    idTypeBook: ITypeBook;
    nameAuthor: string;
    nationality: string;
    biography: string;
    urlAvatar: string | null;
  }

  export interface IEvaluation {}

  export interface IBook {
    idBook: string;
    nameBook: string;
    describe: string;
    valueOfbook: number;
    image: string;
    isLiked: boolean;
    evaluations: IEvaluation[];
    authors: IAuthor[];
    reprintYear: number;
    publisher?: string;
  }
  export interface ILoanHistory {
    idBook: string;
    nameBook: string;
    genre: string;
    dateBorrow: string;
    dateReturn: string;
    avatarUrl: string | null;
  }
  interface IChatContent {
    type: "text" | "image" | "file";
    data: string;
  }

  interface ISendMessagePayload {
    receiverId: string;
    content: IChatContent;
  }
  export interface IChatMessage {
    id: string;
    senderId: string;
    receiverId: string;
    content: IChatContent;
    sentAt: string;
  }
  export interface ILoanSlip {
    idLoanSlipBook: string;
    idTheBook: string;
    idReader: string;
    borrowDate: string; // ISO date string: "2025-05-29T00:00:00"
    returnDate: string; // ISO date string
    fineAmount: number;
    nameBook: string;
    loanPeriod: number;
  }
  export interface IGetStarByIdBook {
    star: number;
    status: number;
  }
  export interface IGetAllComments {
    idEvaluation: string;
    idBook: string;
    idReader: string;
    nameReader: string | null;
    avatarUrl: string | null;
    comment: string;
    star: number;
    createdAt: string;
    updatedAt: string;
  }
  export interface IUserProfileRequest {
    idTypeReader: string | null;
    nameReader: string | null;
    sex: string | null;
    address: string | null;
    email: string | null;
    dob: string | null;
    phone: string | null;
    reader_username: string;
    reader_password: string;
    avatar: string | null;
  }
  export interface ITypeReader {
    idTypeReader: string;
    nameTypeReader: string;
  }
}
