export interface IPouchDBAllDocsResult {
    offset: number;
    total_rows: number;
    rows: IPouchDBRow[];
}

/* results - begin */
export interface IPouchDBGetResult {
    _id: string;
    _rev: string;
}

export interface IPouchDBGetUserResult extends IPouchDBGetResult {
    name: string;
}

export interface IPouchDBPutResult {
    ok: boolean;
    id: string;
    rev: string;
}

export interface IPouchDBRemoveResult {
    ok: boolean;
    id: string;
    rev: string;
}

/* results - end */
export interface IPouchDBRow {
    id: string;
    key: string;
    value: { rev: string };
    doc?: any;
}

export class User {
    _id: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phoneNr: string;

    constructor(username, passsword, name, surname, email, phoneNr) {
        this._id = 'user:' + new Date().getTime();
        this.username = username;
        this.password = passsword;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNr = phoneNr;
    }
}

