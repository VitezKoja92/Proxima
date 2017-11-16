export interface IPouchDBAllDocsResult {
    offset: number;
    total_rows: number;
    rows: IPouchDBRow[];
}

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

export interface IPouchDBRow {
    id: string;
    key: string;
    value: { rev: string };
    doc?: any;
}

export interface IPouchDBCreateIndexResult {
    result: string;
}

export interface IPouchDBFindUsersResult {
    docs: User[];
    warning?: string;
}

export interface IPouchDBFindPatientsResult {
    docs: Patient[];
    warning?: string;
}

export interface EditPersonalInfoModel {
    name: string;
    surname: string;
    city: string;
    country: string;
    postCode: number;
    street: string;
    streetNr: string;
    profession: string;
}

export class User {
    _id: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phoneNr?: string;

    constructor(username: string, passsword: string, name: string, surname: string, email: string, phoneNr?: string) {
        this._id = 'user:' + new Date().getTime();
        this.username = username;
        this.password = passsword;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNr = phoneNr;
    }
}

export class Patient {
    _id: string;
    _rev: string;
    personalInfo: PatientPersonalInfo;
    medicalHistory?: MedicalHistoryItem[];

    constructor(personalInfo: PatientPersonalInfo, medicalHistory?: MedicalHistoryItem[]) {
        this._id = 'patient:' + new Date().getTime();
        this.personalInfo = personalInfo;
        this.medicalHistory = medicalHistory;
    }
}

export class PatientPersonalInfo {
    name: string;
    surname: string;
    dateOfBirth: Date;
    address: Address;
    profession: string;

    constructor(name: string, surname: string, dateOfBirth: Date, address: Address, profession: string) {
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.profession = profession;
    }
}

export class MedicalHistoryItem {
    _id: string;
    date: string;
    anamnesis: Anamnesis;
    diagnostics: Diagnostics;
    statusLocalis: string;
    diagnosis: string;
    recommendedTherapy: Therapy;

    constructor(
        date: string,
        anamnesis: Anamnesis,
        diagnostics: Diagnostics,
        statusLocalis: string,
        diagnosis: string,
        recommendedTherapy: Therapy,
        _id?: string
    ) {
        this._id = _id;
        this.date = date;
        this.anamnesis = anamnesis;
        this.diagnostics = diagnostics;
        this.statusLocalis = statusLocalis;
        this.diagnosis  = diagnosis;
        this.recommendedTherapy = recommendedTherapy;
        }
}

export class Address {
    country: string;
    city: string;
    postcode: Number;
    street: string;
    streetNo: string;

    constructor(country: string, city: string, postcode: Number, street: string, streetNo: string) {
        this.country = country;
        this.city = city;
        this.postcode = postcode;
        this.street = street;
        this.streetNo = streetNo;
    }
}

export class Anamnesis {
    mainDifficulties: string;
    anamnesisMorbi: string;
    anamnesisVitae: string;
    anamnesisFamiliae: string;

    constructor(mainDifficulties: string, anamnesisMorbi: string, anamnesisVitae: string, anamnesisFamiliae: string) {
        this.mainDifficulties = mainDifficulties;
        this.anamnesisMorbi = anamnesisMorbi;
        this.anamnesisVitae = anamnesisVitae;
        this.anamnesisFamiliae = anamnesisFamiliae;
    }
}

export class Diagnostics {
    labFindings: string;
    labFindings_date: string;
    RTG: string;
    RTG_date: string;
    NMR: string;
    NMR_date: string;
    EMNG: string;
    EMNG_date: string;

    constructor(
        labFindings: string, labFindings_date: string,
        RTG: string, RTG_date: string,
        NMR: string, NMR_date: string,
        EMNG: string, EMNG_date: string
    ) {
        this.labFindings = labFindings;
        this.labFindings_date = labFindings_date;
        this.RTG = RTG;
        this.RTG_date = RTG_date;
        this.NMR = NMR;
        this.NMR_date = NMR_date;
        this.EMNG = EMNG;
        this.EMNG_date = EMNG_date;
    }
}

export class Therapy {
    recommendation: string;
    mediocentricTherapy: string;
    physicalTherapy: PhysicalTherapy;

    constructor(recommendation: string, mediocentricTherapy: string, physicalTherapy: PhysicalTherapy) {
        this.recommendation = recommendation;
        this.mediocentricTherapy = mediocentricTherapy;
        this.physicalTherapy = physicalTherapy;
    }
}

export class PhysicalTherapy {
    laserTherapy: string[];
    electroTherapy: ElectroTherapy;
    cryotherapy: boolean;
    IMP: boolean;
    ultrasound: boolean;

    constructor(
        cryotherapy: boolean,
        IMP: boolean,
        ultrasound: boolean,
        laserTherapy?: string[],
        electroTherapy?: ElectroTherapy
    ) {
        this.laserTherapy = laserTherapy;
        this.electroTherapy = electroTherapy;
        this.cryotherapy = cryotherapy;
        this.IMP = IMP;
        this.ultrasound = ultrasound;
    }
}

export enum LaserTherapyChoices {
    One = <any>'2500Hz - 6J',
    Two = <any>'80Hz - 8J',
    Three = <any>'600Hz - 6J',
    Four = <any>'80Hz - 8J',
    Five = <any>'80Hz - 16J'
}

export class ElectroTherapy {
    IFS: boolean;
    DD: boolean;
    GS: boolean;
    ES: boolean;

    constructor(IFS: boolean, DD: boolean, GS: boolean, ES: boolean) {
        this.IFS = IFS;
        this.DD = DD;
        this.GS = GS;
        this.ES = ES;
    }
}

export class Appointment {
    _id: string;
    user: User;
    patient: Patient;
    date: Date;
    hour: number;
    minute: number;
    description: string;

    constructor(user: User, patient: Patient,
        dateAndTime: Date, hour: number, minute: number, description: string) {
        this._id = 'appointment:' + new Date().getTime();
        this.user = user;
        this.patient = patient;
        this.date = dateAndTime;
        this.hour = hour;
        this.minute = minute;
        this.description = description;
    }
}
