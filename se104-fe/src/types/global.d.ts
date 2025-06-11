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
  }

  interface ISignIn {
    token: string;
    refreshToken: string;
  }

  export interface IAddAuthor {
    idTypeBook: string;
    nameAuthor: string;
    nationality: string;
    biography: string;
    avatarImage: File;
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
    idTypeBook: string;
    nameHeaderBook: string;
    describeBook: string;
    idAuthors: string[];
    bookCreateRequest: IBookCreateRequest;
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
  export interface IUpdateReaderPayload {
    nameReader: string;
    sex: string;
    address: string;
    email: string;
    dob: string; // cái này dùng datepicker xong r dùng hàm .toISOString()
    phone: string;
    readerPassword: string;
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

  interface IUser {
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
}
